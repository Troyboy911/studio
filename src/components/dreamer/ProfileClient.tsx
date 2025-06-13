
"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserCircle, Briefcase, Info, Save, PlusCircle, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PROFILE_STORAGE_KEY = 'dreamerProfile';

interface ProfileData {
  imageUrl?: string;
  description?: string;
  skills?: string[];
}

export default function ProfileClient() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('https://placehold.co/120x120.png');
  const [description, setDescription] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (savedProfile) {
      try {
        const parsedProfile: ProfileData = JSON.parse(savedProfile);
        if (parsedProfile.imageUrl) setProfileImageUrl(parsedProfile.imageUrl); // For now, just loads URL if one was manually set/mocked
        if (parsedProfile.description) setDescription(parsedProfile.description);
        if (parsedProfile.skills) setSkills(parsedProfile.skills);
      } catch (e) {
        console.error("Failed to parse profile from localStorage", e);
      }
    }
  }, []);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file)); // Show preview
    }
  };

  const handleAddSkill = (e: FormEvent) => {
    e.preventDefault();
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSaveProfile = () => {
    // In a real app, you would upload the profileImage to a server
    // and get back a URL to save in profileImageUrl.
    // For this prototype, we're just saving the local preview URL if an image was selected, or existing.
    const profileToSave: ProfileData = {
      // If profileImage is set, it means a new image was selected for preview.
      // A real app would upload profileImage and store the resulting URL.
      // For now, we'll store the objectURL for local preview persistence in this session,
      // but it won't persist across browser restarts if it's an objectURL.
      // A more robust mock would be to just save a placeholder string if profileImage is set.
      imageUrl: profileImage ? profileImageUrl : (profileImageUrl.startsWith('https://placehold.co') ? undefined : profileImageUrl),
      description,
      skills,
    };

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileToSave));
    toast({
      title: 'Profile Saved!',
      description: 'Your profile information has been updated.',
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Card className="shadow-lg">
          <CardHeader className="items-center">
            <Avatar className="w-32 h-32 mb-4 border-4 border-primary">
              <AvatarImage src={profileImageUrl} alt="Profile Picture" />
              <AvatarFallback><UserCircle className="w-16 h-16" /></AvatarFallback>
            </Avatar>
            <div className="relative group w-full">
              <Input id="picture" type="file" accept="image/*" onChange={handleImageChange} className="w-full opacity-0 absolute inset-0 z-10 cursor-pointer" />
              <Button variant="outline" className="w-full pointer-events-none" asChild>
                <div> {/* This div is necessary for the button styling to apply correctly with the input overlay */}
                  <ImageIcon className="mr-2 h-4 w-4" /> Change Photo
                </div>
              </Button>
            </div>
            <CardDescription className="text-xs text-center mt-2">
              (Image upload is simulated. Photo will be previewed locally.)
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="md:col-span-2 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Info className="mr-2 h-6 w-6 text-primary" /> About Me
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Tell us a bit about yourself, your passions, and what drives your dreams..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Briefcase className="mr-2 h-6 w-6 text-primary" /> My Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSkill} className="flex gap-2 mb-4">
              <Input
                placeholder="Add a skill (e.g., Web Development, Marketing)"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
              />
              <Button type="submit" variant="outline" size="icon">
                <PlusCircle className="h-5 w-5" />
                <span className="sr-only">Add Skill</span>
              </Button>
            </form>
            <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? skills.map(skill => (
                <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">
                  {skill}
                  <button onClick={() => handleRemoveSkill(skill)} className="ml-2 appearance-none outline-none focus:outline-none" aria-label={`Remove ${skill}`}>
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              )) : (
                <p className="text-sm text-muted-foreground">No skills added yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveProfile} className="bg-primary hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" /> Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
