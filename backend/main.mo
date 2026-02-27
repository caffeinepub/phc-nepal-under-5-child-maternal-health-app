import Time "mo:core/Time";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Option "mo:core/Option";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  /// Persistent Blob Storage
  include MixinStorage();

  /// Persistent User Authentication With Role-Based Access Control (RBAC)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  /// Data Types for Core Features

  type Languages = {
    #english;
    #hindi;
    #nepali;
  };

  type UserRole = {
    #pregnantWoman;
    #mother;
    #familyMember;
    #healthWorker;
  };

  type UserProfile = {
    name : Text;
    age : Nat;
    country : Text;
    role : UserRole;
    expectedDueDate : ?Time.Time;
    childDob : ?Time.Time;
  };

  type PregnantEvent = {
    eventType : Text;
    date : Time.Time;
  };

  type ANCVisit = {
    visitNumber : Nat;
    date : ?Time.Time;
    notes : ?Text;
    completed : Bool;
  };

  type GrowthMeasurement = {
    measurementId : Text;
    timestamp : Int;
    weight : ?Float;
    height : ?Float;
    headCircumference : ?Float;
  };

  type ImmunizationRecord = {
    vaccine : Text;
    date : ?Time.Time;
    completed : Bool;
  };

  type PostCategory = {
    #pregnancy;
    #newborn;
    #toddler;
    #feeding;
    #vaccination;
    #mentalHealth;
  };

  type Post = {
    id : Text;
    authorPrincipal : Principal;
    author : Text;
    title : Text;
    content : Text;
    category : PostCategory;
    timestamp : Int;
    replies : [Post];
  };

  // Persistent Storage
  let pages = Map.empty<Text, Text>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let pregnancyEvents = Map.empty<Text, [PregnantEvent]>();
  let ancVisits = Map.empty<Text, [ANCVisit]>();
  let growthMeasurements = Map.empty<Text, [GrowthMeasurement]>();
  let immunizations = Map.empty<Text, [ImmunizationRecord]>();
  let posts = Map.empty<Text, Post>();
  var totalVisitors = 0;

  /// -----------------------------------------------------------------------
  /// Required Profile Interface (getCallerUserProfile, saveCallerUserProfile,
  /// getUserProfile)
  /// -----------------------------------------------------------------------

  /// Get the profile of the calling user.
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  /// Save/update the profile of the calling user.
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save their profile");
    };
    userProfiles.add(caller, profile);
  };

  /// Get the profile of any user. Callers may only view their own profile
  /// unless they are an admin.
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  /// -----------------------------------------------------------------------
  /// General Content Management (admin-only writes)
  /// -----------------------------------------------------------------------

  /// Save localised page content. Only admins may update content.
  public shared ({ caller }) func savePageContent(path : Text, content : Text, language : Languages) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can save page content");
    };
    let key = path # "::" # (switch language {
      case (#english) { "en" };
      case (#hindi) { "hi" };
      case (#nepali) { "ne" };
    });
    pages.add(key, content);
  };

  /// Retrieve localised page content. Available to everyone.
  public query func getPageContent(path : Text, language : Languages) : async ?Text {
    let key = path # "::" # (switch language {
      case (#english) { "en" };
      case (#hindi) { "hi" };
      case (#nepali) { "ne" };
    });
    pages.get(key);
  };

  /// -----------------------------------------------------------------------
  /// Community Posts
  /// -----------------------------------------------------------------------

  /// Create or update a post. Users may only modify their own posts;
  /// admins may modify any post.
  public shared ({ caller }) func savePost(id : Text, post : Post) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save posts");
    };
    // If a post with this id already exists, only the original author or an
    // admin may overwrite it.
    switch (posts.get(id)) {
      case (?existing) {
        if (existing.authorPrincipal != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only edit your own posts");
        };
      };
      case (null) {};
    };
    // Ensure the stored post always records the real caller as author principal.
    let sanitised : Post = {
      id = post.id;
      authorPrincipal = caller;
      author = post.author;
      title = post.title;
      content = post.content;
      category = post.category;
      timestamp = post.timestamp;
      replies = post.replies;
    };
    posts.add(id, sanitised);
  };

  /// Retrieve a single post by id. Available to everyone.
  public query func getPost(id : Text) : async ?Post {
    posts.get(id);
  };

  /// -----------------------------------------------------------------------
  /// Pregnancy Event Management
  /// -----------------------------------------------------------------------

  /// Log a pregnancy event for the calling user only.
  public shared ({ caller }) func savePregnantEvent(event : PregnantEvent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save pregnancy events");
    };
    let key = caller.toText();
    let userEvents = switch (pregnancyEvents.get(key)) {
      case (null) { [] };
      case (?existingEvents) { existingEvents };
    };
    // Deduplicate: remove any existing event with the same type and date.
    let filtered = userEvents.filter(
      func(e : PregnantEvent) : Bool {
        not (e.eventType == event.eventType and e.date == event.date);
      },
    );
    pregnancyEvents.add(key, filtered.concat([event]));
  };

  /// Retrieve pregnancy events for the calling user.
  public query ({ caller }) func getPregnantEvents() : async [PregnantEvent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view pregnancy events");
    };
    switch (pregnancyEvents.get(caller.toText())) {
      case (null) { [] };
      case (?events) { events };
    };
  };

  /// Admin helper: retrieve pregnancy events for any user.
  public query ({ caller }) func getPregnantEventsForUser(user : Principal) : async [PregnantEvent] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view other users' pregnancy events");
    };
    switch (pregnancyEvents.get(user.toText())) {
      case (null) { [] };
      case (?events) { events };
    };
  };

  /// -----------------------------------------------------------------------
  /// ANC Visit Management
  /// -----------------------------------------------------------------------

  /// Log an ANC visit for the calling user only.
  public shared ({ caller }) func saveANCVisit(visit : ANCVisit) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save ANC visits");
    };
    let key = caller.toText();
    let userVisits = switch (ancVisits.get(key)) {
      case (null) { [] };
      case (?existingVisits) { existingVisits };
    };
    // Replace any existing visit with the same visit number.
    let filtered = userVisits.filter(
      func(v : ANCVisit) : Bool { v.visitNumber != visit.visitNumber },
    );
    ancVisits.add(key, filtered.concat([visit]));
  };

  /// Retrieve ANC visits for the calling user.
  public query ({ caller }) func getANCVisits() : async [ANCVisit] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view ANC visits");
    };
    switch (ancVisits.get(caller.toText())) {
      case (null) { [] };
      case (?visits) { visits };
    };
  };

  /// Admin helper: retrieve ANC visits for any user.
  public query ({ caller }) func getANCVisitsForUser(user : Principal) : async [ANCVisit] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view other users' ANC visits");
    };
    switch (ancVisits.get(user.toText())) {
      case (null) { [] };
      case (?visits) { visits };
    };
  };

  /// -----------------------------------------------------------------------
  /// Growth Measurement Management
  /// -----------------------------------------------------------------------

  /// Save a growth measurement for the calling user's child.
  public shared ({ caller }) func saveMeasurement(record : GrowthMeasurement) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save measurements");
    };
    let key = caller.toText();
    let existing = switch (growthMeasurements.get(key)) {
      case (null) { [] };
      case (?records) { records };
    };
    // Replace record with same measurementId if present, otherwise append.
    let filtered = existing.filter(
      func(m : GrowthMeasurement) : Bool { m.measurementId != record.measurementId },
    );
    growthMeasurements.add(key, filtered.concat([record]));
  };

  /// Retrieve growth measurements for the calling user.
  public query ({ caller }) func getMeasurements() : async [GrowthMeasurement] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view measurements");
    };
    switch (growthMeasurements.get(caller.toText())) {
      case (null) { [] };
      case (?records) { records };
    };
  };

  /// Admin helper: retrieve growth measurements for any user.
  public query ({ caller }) func getMeasurementsForUser(user : Principal) : async [GrowthMeasurement] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view other users' measurements");
    };
    switch (growthMeasurements.get(user.toText())) {
      case (null) { [] };
      case (?records) { records };
    };
  };

  /// -----------------------------------------------------------------------
  /// Immunization Records
  /// -----------------------------------------------------------------------

  /// Log an immunization record for the calling user's child.
  public shared ({ caller }) func saveImmunization(record : ImmunizationRecord) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save immunizations");
    };
    let key = caller.toText();
    let userRecords = switch (immunizations.get(key)) {
      case (null) { [] };
      case (?existingRecords) { existingRecords };
    };
    // Replace any existing record for the same vaccine.
    let filtered = userRecords.filter(
      func(r : ImmunizationRecord) : Bool { r.vaccine != record.vaccine },
    );
    immunizations.add(key, filtered.concat([record]));
  };

  /// Retrieve immunization records for the calling user.
  public query ({ caller }) func getImmunizations() : async [ImmunizationRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view immunizations");
    };
    switch (immunizations.get(caller.toText())) {
      case (null) { [] };
      case (?records) { records };
    };
  };

  /// Admin helper: retrieve immunization records for any user.
  public query ({ caller }) func getImmunizationsForUser(user : Principal) : async [ImmunizationRecord] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view other users' immunizations");
    };
    switch (immunizations.get(user.toText())) {
      case (null) { [] };
      case (?records) { records };
    };
  };

  /// -----------------------------------------------------------------------
  /// Visitor / Analytics Stats
  /// -----------------------------------------------------------------------

  /// Record a visit. Any caller (including guests / anonymous) may call this.
  /// No sensitive data is written; only aggregate counters are updated.
  public shared func recordVisit() : async () {
    totalVisitors += 1;
  };

  /// Retrieve total visitor count. Available to everyone.
  public query func getTotalVisitors() : async Nat {
    totalVisitors;
  };
};
