import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { insertSettingsSchema, insertFriendSchema, insertProjectSchema, insertSocialMediaSchema } from '@shared/schema';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Admin() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isLoggedIn, isLoading, error, login, logout } = useAuth();
  const queryClient = useQueryClient();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    const success = await login(data.username, data.password);
    if (success) {
      toast({
        title: "Login berhasil",
        description: "Selamat datang di dashboard admin",
      });
    }
  };

  const handleLogout = () => {
    logout();
    loginForm.reset();
    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari dashboard admin",
    });
  };

  if (!isLoggedIn) {
    return (
      <section id="admin" className="min-h-screen py-20 bg-background transition-colors duration-300 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">{t('admin.login')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div>
                  <Label htmlFor="username">{t('admin.username')}</Label>
                  <Input 
                    id="username"
                    {...loginForm.register('username')}
                    className="mt-1"
                  />
                  {loginForm.formState.errors.username && (
                    <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.username.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="password">{t('admin.password')}</Label>
                  <Input 
                    id="password"
                    type="password"
                    {...loginForm.register('password')}
                    className="mt-1"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gold hover:bg-gold-dark"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : t('admin.loginBtn')}
                </Button>
              </form>
              
              {error && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-center">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Settings Management
  const { data: settings } = useQuery({
    queryKey: ['/api/settings'],
  });

  const settingsForm = useForm({
    resolver: zodResolver(insertSettingsSchema),
    defaultValues: settings || {
      profileName: '',
      profileAge: 15,
      profileImageUrl: '',
      whatsappUrl: '',
      backgroundAudioUrl: '',
      statusTexts: { id: [], en: [] }
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => apiRequest('PUT', '/api/settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({ title: "Pengaturan berhasil disimpan" });
    },
  });

  const handleSaveSettings = (data: any) => {
    updateSettingsMutation.mutate(data);
  };

  // Friends Management
  const { data: friends } = useQuery({
    queryKey: ['/api/friends'],
  });

  const createFriendMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/friends', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/friends'] });
      toast({ title: "Teman berhasil ditambahkan" });
    },
  });

  const deleteFriendMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/friends/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/friends'] });
      toast({ title: "Teman berhasil dihapus" });
    },
  });

  // Projects Management
  const { data: projects } = useQuery({
    queryKey: ['/api/projects'],
  });

  const createProjectMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/projects', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({ title: "Proyek berhasil ditambahkan" });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({ title: "Proyek berhasil dihapus" });
    },
  });

  // Social Media Management
  const { data: socialMedia } = useQuery({
    queryKey: ['/api/social-media'],
  });

  const createSocialMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/social-media', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social-media'] });
      toast({ title: "Media sosial berhasil ditambahkan" });
    },
  });

  const deleteSocialMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/social-media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social-media'] });
      toast({ title: "Media sosial berhasil dihapus" });
    },
  });

  return (
    <section id="admin" className="min-h-screen py-20 bg-gradient-to-br from-background to-muted/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <Card className="shadow-2xl border-gold/20 bg-card/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gold/10 to-gold-light/10 border-b border-gold/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gold flex items-center gap-3">
                  <i className="fas fa-cog animate-spin" />
                  {t('admin.dashboard')}
                </CardTitle>
                <p className="text-muted-foreground mt-2">Kelola konten website portfolio Anda</p>
              </div>
              <Button onClick={onLogout} variant="destructive" className="shadow-lg">
                <i className="fas fa-sign-out-alt mr-2" />
                {t('admin.logout')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 bg-muted/50">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <i className="fas fa-user text-sm" />
                  <span className="hidden sm:inline">{t('admin.profile')}</span>
                </TabsTrigger>
                <TabsTrigger value="friends" className="flex items-center gap-2">
                  <i className="fas fa-users text-sm" />
                  <span className="hidden sm:inline">{t('admin.friends')}</span>
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-2">
                  <i className="fas fa-code text-sm" />
                  <span className="hidden sm:inline">{t('admin.projects')}</span>
                </TabsTrigger>
                <TabsTrigger value="social" className="flex items-center gap-2">
                  <i className="fas fa-share-alt text-sm" />
                  <span className="hidden sm:inline">{t('admin.social')}</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6">
                <form onSubmit={settingsForm.handleSubmit(handleSaveSettings)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>{t('admin.profileImage')}</Label>
                      <Input {...settingsForm.register('profileImageUrl')} />
                    </div>
                    <div>
                      <Label>{t('admin.name')}</Label>
                      <Input {...settingsForm.register('profileName')} />
                    </div>
                    <div>
                      <Label>{t('admin.age')}</Label>
                      <Input type="number" {...settingsForm.register('profileAge', { valueAsNumber: true })} />
                    </div>
                    <div>
                      <Label>{t('admin.whatsapp')}</Label>
                      <Input {...settingsForm.register('whatsappUrl')} />
                    </div>
                    <div className="md:col-span-2">
                      <Label>{t('admin.audioUrl')}</Label>
                      <Input {...settingsForm.register('backgroundAudioUrl')} />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gold hover:bg-gold-dark"
                    disabled={updateSettingsMutation.isPending}
                  >
                    {updateSettingsMutation.isPending ? 'Saving...' : t('admin.save')}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="friends" className="space-y-6">
                <FriendsManagement 
                  friends={friends || []}
                  onAdd={(data) => createFriendMutation.mutate(data)}
                  onDelete={(id) => deleteFriendMutation.mutate(id)}
                />
              </TabsContent>
              
              <TabsContent value="projects" className="space-y-6">
                <ProjectsManagement 
                  projects={projects || []}
                  onAdd={(data) => createProjectMutation.mutate(data)}
                  onDelete={(id) => deleteProjectMutation.mutate(id)}
                />
              </TabsContent>
              
              <TabsContent value="social" className="space-y-6">
                <SocialMediaManagement 
                  socialMedia={socialMedia || []}
                  onAdd={(data) => createSocialMutation.mutate(data)}
                  onDelete={(id) => deleteSocialMutation.mutate(id)}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// Component sub-components for management
function FriendsManagement({ friends, onAdd, onDelete }: any) {
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(insertFriendSchema),
  });

  const handleAdd = (data: any) => {
    onAdd(data);
    form.reset();
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('admin.friends')}</h3>
        <Button onClick={() => setIsAdding(!isAdding)}>{t('admin.add')}</Button>
      </div>
      
      {isAdding && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-4">
              <div>
                <Label>Nama</Label>
                <Input {...form.register('name')} />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Textarea {...form.register('description')} />
              </div>
              <div>
                <Label>URL Gambar</Label>
                <Input {...form.register('imageUrl')} />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Simpan</Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Batal</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-4">
        {friends.map((friend: any) => (
          <Card key={friend.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img src={friend.imageUrl} alt={friend.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-semibold">{friend.name}</h4>
                  <p className="text-sm text-muted-foreground">{friend.description}</p>
                </div>
              </div>
              <Button onClick={() => onDelete(friend.id)} variant="destructive" size="sm">
                {t('admin.delete')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProjectsManagement({ projects, onAdd, onDelete }: any) {
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(insertProjectSchema),
  });

  const handleAdd = (data: any) => {
    onAdd(data);
    form.reset();
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('admin.projects')}</h3>
        <Button onClick={() => setIsAdding(!isAdding)}>{t('admin.add')}</Button>
      </div>
      
      {isAdding && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-4">
              <div>
                <Label>Nama Proyek</Label>
                <Input {...form.register('name')} />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Textarea {...form.register('description')} />
              </div>
              <div>
                <Label>URL Gambar</Label>
                <Input {...form.register('imageUrl')} />
              </div>
              <div>
                <Label>URL Proyek</Label>
                <Input {...form.register('projectUrl')} />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Simpan</Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Batal</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-4">
        {projects.map((project: any) => (
          <Card key={project.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img src={project.imageUrl} alt={project.name} className="w-16 h-12 rounded object-cover" />
                <div>
                  <h4 className="font-semibold">{project.name}</h4>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
              </div>
              <Button onClick={() => onDelete(project.id)} variant="destructive" size="sm">
                {t('admin.delete')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SocialMediaManagement({ socialMedia, onAdd, onDelete }: any) {
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(insertSocialMediaSchema),
  });

  const handleAdd = (data: any) => {
    onAdd(data);
    form.reset();
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('admin.social')}</h3>
        <Button onClick={() => setIsAdding(!isAdding)}>{t('admin.add')}</Button>
      </div>
      
      {isAdding && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-4">
              <div>
                <Label>Nama Platform</Label>
                <Input {...form.register('name')} />
              </div>
              <div>
                <Label>Username</Label>
                <Input {...form.register('username')} />
              </div>
              <div>
                <Label>URL</Label>
                <Input {...form.register('url')} />
              </div>
              <div>
                <Label>Kelas Icon (Font Awesome)</Label>
                <Input {...form.register('iconClass')} placeholder="fab fa-instagram" />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Simpan</Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Batal</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-4">
        {socialMedia.map((social: any) => (
          <Card key={social.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <i className={`${social.iconClass} text-2xl`} />
                <div>
                  <h4 className="font-semibold">{social.name}</h4>
                  <p className="text-sm text-muted-foreground">{social.username}</p>
                </div>
              </div>
              <Button onClick={() => onDelete(social.id)} variant="destructive" size="sm">
                {t('admin.delete')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
