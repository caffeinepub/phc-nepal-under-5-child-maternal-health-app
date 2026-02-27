import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface PregnantEvent {
    date: Time;
    eventType: string;
}
export interface ANCVisit {
    visitNumber: bigint;
    date?: Time;
    completed: boolean;
    notes?: string;
}
export interface GrowthMeasurement {
    weight?: number;
    height?: number;
    measurementId: string;
    timestamp: bigint;
    headCircumference?: number;
}
export interface Post {
    id: string;
    title: string;
    content: string;
    author: string;
    timestamp: bigint;
    replies: Array<Post>;
    category: PostCategory;
    authorPrincipal: Principal;
}
export interface ImmunizationRecord {
    vaccine: string;
    date?: Time;
    completed: boolean;
}
export interface UserProfile {
    age: bigint;
    country: string;
    expectedDueDate?: Time;
    name: string;
    role: UserRole;
    childDob?: Time;
}
export enum Languages {
    hindi = "hindi",
    nepali = "nepali",
    english = "english"
}
export enum PostCategory {
    newborn = "newborn",
    toddler = "toddler",
    vaccination = "vaccination",
    feeding = "feeding",
    mentalHealth = "mentalHealth",
    pregnancy = "pregnancy"
}
export enum UserRole {
    healthWorker = "healthWorker",
    familyMember = "familyMember",
    mother = "mother",
    pregnantWoman = "pregnantWoman"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    /**
     * / Retrieve ANC visits for the calling user.
     */
    getANCVisits(): Promise<Array<ANCVisit>>;
    /**
     * / Admin helper: retrieve ANC visits for any user.
     */
    getANCVisitsForUser(user: Principal): Promise<Array<ANCVisit>>;
    /**
     * / -----------------------------------------------------------------------
     * / Required Profile Interface (getCallerUserProfile, saveCallerUserProfile,
     * / getUserProfile)
     * / -----------------------------------------------------------------------
     * / Get the profile of the calling user.
     */
    getCallerUserProfile(): Promise<UserProfile | null>;
    /**
     * / Persistent Blob Storage
     */
    getCallerUserRole(): Promise<UserRole__1>;
    /**
     * / Retrieve immunization records for the calling user.
     */
    getImmunizations(): Promise<Array<ImmunizationRecord>>;
    /**
     * / Admin helper: retrieve immunization records for any user.
     */
    getImmunizationsForUser(user: Principal): Promise<Array<ImmunizationRecord>>;
    /**
     * / Retrieve growth measurements for the calling user.
     */
    getMeasurements(): Promise<Array<GrowthMeasurement>>;
    /**
     * / Admin helper: retrieve growth measurements for any user.
     */
    getMeasurementsForUser(user: Principal): Promise<Array<GrowthMeasurement>>;
    /**
     * / Retrieve localised page content. Available to everyone.
     */
    getPageContent(path: string, language: Languages): Promise<string | null>;
    /**
     * / Retrieve a single post by id. Available to everyone.
     */
    getPost(id: string): Promise<Post | null>;
    /**
     * / Retrieve pregnancy events for the calling user.
     */
    getPregnantEvents(): Promise<Array<PregnantEvent>>;
    /**
     * / Admin helper: retrieve pregnancy events for any user.
     */
    getPregnantEventsForUser(user: Principal): Promise<Array<PregnantEvent>>;
    /**
     * / Retrieve total visitor count. Available to everyone.
     */
    getTotalVisitors(): Promise<bigint>;
    /**
     * / Get the profile of any user. Callers may only view their own profile
     * / unless they are an admin.
     */
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / -----------------------------------------------------------------------
     * / Visitor / Analytics Stats
     * / -----------------------------------------------------------------------
     * / Record a visit. Any caller (including guests / anonymous) may call this.
     * / No sensitive data is written; only aggregate counters are updated.
     */
    recordVisit(): Promise<void>;
    /**
     * / -----------------------------------------------------------------------
     * / ANC Visit Management
     * / -----------------------------------------------------------------------
     * / Log an ANC visit for the calling user only.
     */
    saveANCVisit(visit: ANCVisit): Promise<void>;
    /**
     * / Save/update the profile of the calling user.
     */
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    /**
     * / -----------------------------------------------------------------------
     * / Immunization Records
     * / -----------------------------------------------------------------------
     * / Log an immunization record for the calling user's child.
     */
    saveImmunization(record: ImmunizationRecord): Promise<void>;
    /**
     * / -----------------------------------------------------------------------
     * / Growth Measurement Management
     * / -----------------------------------------------------------------------
     * / Save a growth measurement for the calling user's child.
     */
    saveMeasurement(record: GrowthMeasurement): Promise<void>;
    /**
     * / -----------------------------------------------------------------------
     * / General Content Management (admin-only writes)
     * / -----------------------------------------------------------------------
     * / Save localised page content. Only admins may update content.
     */
    savePageContent(path: string, content: string, language: Languages): Promise<void>;
    /**
     * / -----------------------------------------------------------------------
     * / Community Posts
     * / -----------------------------------------------------------------------
     * / Create or update a post. Users may only modify their own posts;
     * / admins may modify any post.
     */
    savePost(id: string, post: Post): Promise<void>;
    /**
     * / -----------------------------------------------------------------------
     * / Pregnancy Event Management
     * / -----------------------------------------------------------------------
     * / Log a pregnancy event for the calling user only.
     */
    savePregnantEvent(event: PregnantEvent): Promise<void>;
}
