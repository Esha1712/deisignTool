import { renderHook } from '@testing-library/react';
import type { Diagram } from '../types/diagram.types';
import type { AppUser } from '../types/user.types';

jest.mock('../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

import { usePermissions } from '../hooks/usePermissions';
import { useAuth } from '../hooks/useAuth';

describe('usePermissions Hook', () => {
  const mockUser: AppUser = {
    uid: 'user-123',
    email: 'test@example.com',
    role: 'editor',
  };

  const mockDiagram: Diagram = {
    id: 'diagram-1',
    ownerId: 'user-123',
    nodes: [],
    edges: [],
    sharedWith: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when user is null', () => {
    it('should return all false permissions', () => {
      (useAuth as jest.Mock).mockReturnValue({ user: null });

      const { result } = renderHook(() => usePermissions(mockDiagram));

      expect(result.current).toEqual({
        isOwner: false,
        isEditor: false,
        isViewer: false,
        hasAccess: false,
        role: undefined,
      });
    });
  });

  describe('when diagram is null', () => {
    it('should return all false permissions', () => {
      (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

      const { result } = renderHook(() => usePermissions(null));

      expect(result.current).toEqual({
        isOwner: false,
        isEditor: false,
        isViewer: false,
        hasAccess: false,
        role: undefined,
      });
    });
  });

  describe('when user is the owner', () => {
    it('should return owner permissions', () => {
      (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

      const { result } = renderHook(() => usePermissions(mockDiagram));

      expect(result.current.isOwner).toBe(true);
      expect(result.current.isEditor).toBe(true);
      expect(result.current.isViewer).toBe(false);
      expect(result.current.hasAccess).toBe(true);
      expect(result.current.role).toBe('editor');
    });
  });

  describe('when user has editor access via sharing', () => {
    it('should return editor permissions', () => {
      const differentUser: AppUser = {
        uid: 'user-456',
        email: 'editor@example.com',
        role: 'editor',
      };

      const sharedDiagram: Diagram = {
        ...mockDiagram,
        ownerId: 'owner-123',
        sharedWith: {
          'user-456': 'editor',
        },
      };

      (useAuth as jest.Mock).mockReturnValue({ user: differentUser });

      const { result } = renderHook(() => usePermissions(sharedDiagram));

      expect(result.current.isOwner).toBe(false);
      expect(result.current.isEditor).toBe(true);
      expect(result.current.isViewer).toBe(false);
      expect(result.current.hasAccess).toBe(true);
      expect(result.current.role).toBe('editor');
    });
  });

  describe('when user has viewer access via sharing', () => {
    it('should return viewer permissions', () => {
      const viewerUser: AppUser = {
        uid: 'user-789',
        email: 'viewer@example.com',
        role: 'viewer',
      };

      const sharedDiagram: Diagram = {
        ...mockDiagram,
        ownerId: 'owner-123',
        sharedWith: {
          'user-789': 'viewer',
        },
      };

      (useAuth as jest.Mock).mockReturnValue({ user: viewerUser });

      const { result } = renderHook(() => usePermissions(sharedDiagram));

      expect(result.current.isOwner).toBe(false);
      expect(result.current.isEditor).toBe(false);
      expect(result.current.isViewer).toBe(true);
      expect(result.current.hasAccess).toBe(true);
      expect(result.current.role).toBe('viewer');
    });
  });

  describe('when user has no access', () => {
    it('should return no permissions', () => {
      const noAccessUser: AppUser = {
        uid: 'user-999',
        email: 'noaccess@example.com',
        role: 'viewer',
      };

      const privateDiagram: Diagram = {
        ...mockDiagram,
        ownerId: 'owner-123',
        sharedWith: {},
      };

      (useAuth as jest.Mock).mockReturnValue({ user: noAccessUser });

      const { result } = renderHook(() => usePermissions(privateDiagram));

      expect(result.current.isOwner).toBe(false);
      expect(result.current.isEditor).toBe(false);
      expect(result.current.isViewer).toBe(false);
      expect(result.current.hasAccess).toBe(false);
      expect(result.current.role).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle diagram with undefined sharedWith', () => {
      const diagramNoSharedWith: Diagram = {
        id: 'diagram-1',
        ownerId: 'owner-123',
        nodes: [],
        edges: [],
      };

      const differentUser: AppUser = {
        uid: 'user-456',
        email: 'test@example.com',
        role: 'editor',
      };

      (useAuth as jest.Mock).mockReturnValue({ user: differentUser });

      const { result } = renderHook(() => usePermissions(diagramNoSharedWith));

      expect(result.current.hasAccess).toBe(false);
      expect(result.current.role).toBeUndefined();
    });
  });
});
