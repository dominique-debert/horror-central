"use client";

import { useAuth } from "@/context/auth-context";
import { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import AuthGuard from "@/components/auth-guard";
import { apiUpdateProfile, apiUploadFile } from "@/lib/api";

export default function AccountPage() {
  const { user, token, refresh } = useAuth();
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      if (user.image) {
        setAvatarPreview(user.image);
      }
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;

    setIsLoading(true);
    try {
      const updates: { name?: string; image?: string } = {};
      
      if (name !== user.name) {
        updates.name = name;
      }

      // If there's a new avatar file, upload it first
      if (avatarFile) {
        const url = await apiUploadFile(token, avatarFile);
        updates.image = url;
      }

      // Update the profile with the new data using the API function
      if (Object.keys(updates).length > 0) {
        console.log('Updating profile with:', updates);
        await apiUpdateProfile(token, updates);
        console.log('Profile updated, refreshing user data...');
        await refresh();
        console.log('User data refreshed, new user:', user);
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="container mx-auto max-w-2xl py-8">
        <h1 className="mb-8 text-3xl font-bold">Account Settings</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                    {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="avatar" className="cursor-pointer text-sm font-medium">
                  Change avatar
                </Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleAvatarChange}
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  JPG, GIF or PNG. Max 2MB.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled />
            </div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </div>
    </AuthGuard>
  );
}
