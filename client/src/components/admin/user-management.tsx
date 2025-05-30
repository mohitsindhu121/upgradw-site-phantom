import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Trash2, Shield, ShieldCheck, User, Crown } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  storeName?: string;
  isVerified: boolean;
  permissions: string[];
  createdAt?: string;
}

export default function UserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ["/api/users"],
    enabled: true,
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await apiRequest("DELETE", `/api/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "User Deleted",
        description: "User account and all associated data have been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete user account.",
        variant: "destructive",
      });
    },
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: async ({ userId, permissions }: { userId: string; permissions: string[] }) => {
      return await apiRequest("PATCH", `/api/users/${userId}/permissions`, { permissions });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Permissions Updated",
        description: "User permissions have been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update user permissions.",
        variant: "destructive",
      });
    },
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="w-4 h-4" />;
      case 'admin':
        return <ShieldCheck className="w-4 h-4" />;
      case 'seller':
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'admin':
        return 'bg-gradient-to-r from-purple-400 to-blue-500';
      case 'seller':
        return 'bg-gradient-to-r from-green-400 to-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading users...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          User Management
          <Badge variant="outline" className="ml-auto">
            {users?.length || 0} Users
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users?.map((user: User) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border border-[#8B5CF6]/20 rounded-lg bg-[#0A0A0A]/50"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${getRoleColor(user.role)}`}>
                  {getRoleIcon(user.role)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white">{user.username || user.id}</h3>
                    {user.role === 'super_admin' && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                        Owner
                      </Badge>
                    )}
                    {user.isVerified && (
                      <Badge variant="outline" className="border-green-500 text-green-500">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  {user.storeName && (
                    <p className="text-sm text-[#00FFFF]">{user.storeName}</p>
                  )}
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role.replace('_', ' ')} • {user.permissions?.length || 0} permissions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {user.role !== 'super_admin' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newPermissions = user.permissions?.includes('admin') 
                          ? user.permissions.filter(p => p !== 'admin')
                          : [...(user.permissions || []), 'admin'];
                        updatePermissionsMutation.mutate({ 
                          userId: user.id, 
                          permissions: newPermissions 
                        });
                      }}
                      className="border-[#8B5CF6]/30 text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
                    >
                      {user.permissions?.includes('admin') ? 'Remove Admin' : 'Make Admin'}
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#0A0A0A] border-[#8B5CF6]/30">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Delete User Account</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            This will permanently delete {user.username || user.email}'s account and all associated data including products and content. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-600 text-white hover:bg-gray-700">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteUserMutation.mutate(user.id)}
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
                
                {user.role === 'super_admin' && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                    Protected Account
                  </Badge>
                )}
              </div>
            </div>
          ))}
          
          {(!users || users.length === 0) && (
            <div className="text-center py-8 text-gray-400">
              No users found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}