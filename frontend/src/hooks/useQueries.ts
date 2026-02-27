import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, ANCVisit, GrowthMeasurement, ImmunizationRecord, PregnantEvent, Post } from '../backend';

// ─── User Profile ─────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Pregnancy Events ─────────────────────────────────────────────────────────

export function useGetPregnantEvents() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PregnantEvent[]>({
    queryKey: ['pregnantEvents'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPregnantEvents();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSavePregnantEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: PregnantEvent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.savePregnantEvent(event);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pregnantEvents'] });
    },
  });
}

// ─── ANC Visits ───────────────────────────────────────────────────────────────

export function useGetANCVisits() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ANCVisit[]>({
    queryKey: ['ancVisits'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getANCVisits();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveANCVisit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (visit: ANCVisit) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveANCVisit(visit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ancVisits'] });
    },
  });
}

// ─── Growth Measurements ──────────────────────────────────────────────────────

export function useGetMeasurements() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<GrowthMeasurement[]>({
    queryKey: ['measurements'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMeasurements();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveMeasurement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: GrowthMeasurement) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveMeasurement(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements'] });
    },
  });
}

// ─── Immunizations ────────────────────────────────────────────────────────────

export function useGetImmunizations() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ImmunizationRecord[]>({
    queryKey: ['immunizations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getImmunizations();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveImmunization() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: ImmunizationRecord) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveImmunization(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['immunizations'] });
    },
  });
}

// ─── Community Posts ──────────────────────────────────────────────────────────

export function useGetPost(id: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Post | null>({
    queryKey: ['post', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPost(id);
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}

export function useSavePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, post }: { id: string; post: Post }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.savePost(id, post);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
    },
  });
}
