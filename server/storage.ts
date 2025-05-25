import { 
  users, 
  settings, 
  friends, 
  projects, 
  socialMedia,
  type User, 
  type InsertUser,
  type Settings,
  type InsertSettings,
  type Friend,
  type InsertFriend,
  type Project,
  type InsertProject,
  type SocialMedia,
  type InsertSocialMedia
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Settings management
  getSettings(): Promise<Settings | undefined>;
  updateSettings(settings: InsertSettings): Promise<Settings>;
  
  // Friends management
  getFriends(): Promise<Friend[]>;
  createFriend(friend: InsertFriend): Promise<Friend>;
  updateFriend(id: number, friend: Partial<InsertFriend>): Promise<Friend | undefined>;
  deleteFriend(id: number): Promise<boolean>;
  
  // Projects management
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Social media management
  getSocialMedia(): Promise<SocialMedia[]>;
  createSocialMedia(socialMedia: InsertSocialMedia): Promise<SocialMedia>;
  updateSocialMedia(id: number, socialMedia: Partial<InsertSocialMedia>): Promise<SocialMedia | undefined>;
  deleteSocialMedia(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private settings: Settings | undefined;
  private friends: Map<number, Friend>;
  private projects: Map<number, Project>;
  private socialMediaList: Map<number, SocialMedia>;
  private currentUserId: number;
  private currentFriendId: number;
  private currentProjectId: number;
  private currentSocialMediaId: number;

  constructor() {
    this.users = new Map();
    this.friends = new Map();
    this.projects = new Map();
    this.socialMediaList = new Map();
    this.currentUserId = 1;
    this.currentFriendId = 1;
    this.currentProjectId = 1;
    this.currentSocialMediaId = 1;
    
    // Initialize with default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default admin user
    this.createUser({ username: "aka", password: "akaanakbaik17" });
    
    // Create default settings
    this.settings = {
      id: 1,
      profileImageUrl: "https://files.catbox.moe/qfamnx.jpg",
      profileName: "aka",
      profileAge: 15,
      whatsappUrl: "https://wa.me/6281266950382",
      backgroundAudioUrl: "https://www.soundjay.com/misc/sounds/magic-chime-02.mp3",
      statusTexts: {
        id: ["Pelajar", "Developer", "Pemula"],
        en: ["Student", "Developer", "Beginner"]
      }
    };

    // Create default friends
    const defaultFriends = [
      {
        name: "Budi Santoso",
        description: "Teman sekolah yang ahli dalam matematika dan sains",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        order: 1
      },
      {
        name: "Sari Dewi", 
        description: "Designer grafis yang kreatif dan berbakat dalam seni",
        imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
        order: 2
      },
      {
        name: "Andi Rahman",
        description: "Programmer muda yang passionate dalam teknologi",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        order: 3
      },
      {
        name: "Fitri Maharani",
        description: "Penulis muda yang gemar membuat cerita inspiratif",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        order: 4
      }
    ];

    defaultFriends.forEach(friend => this.createFriend(friend));

    // Create default projects
    const defaultProjects = [
      {
        name: "Portfolio Website",
        description: "Website portfolio modern dengan React dan Tailwind CSS",
        imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=350&h=200&fit=crop",
        projectUrl: "#",
        order: 1
      },
      {
        name: "Mobile Learning App",
        description: "Aplikasi pembelajaran interaktif untuk siswa SMA",
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=350&h=200&fit=crop",
        projectUrl: "#",
        order: 2
      },
      {
        name: "2D Puzzle Game",
        description: "Game puzzle edukatif menggunakan JavaScript dan Canvas",
        imageUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=350&h=200&fit=crop",
        projectUrl: "#",
        order: 3
      }
    ];

    defaultProjects.forEach(project => this.createProject(project));

    // Create default social media
    const defaultSocialMedia = [
      {
        name: "TikTok",
        username: "@aka_profile",
        url: "https://tiktok.com/@aka_profile",
        iconClass: "fab fa-tiktok",
        order: 1
      },
      {
        name: "Instagram",
        username: "@aka_ig",
        url: "https://instagram.com/aka_ig",
        iconClass: "fab fa-instagram",
        order: 2
      },
      {
        name: "Telegram",
        username: "@aka_tg",
        url: "https://t.me/aka_tg",
        iconClass: "fab fa-telegram-plane",
        order: 3
      },
      {
        name: "GitHub",
        username: "@aka-dev",
        url: "https://github.com/aka-dev",
        iconClass: "fab fa-github",
        order: 4
      },
      {
        name: "WhatsApp",
        username: "+62 812-6695-0382",
        url: "https://wa.me/6281266950382",
        iconClass: "fab fa-whatsapp",
        order: 5
      }
    ];

    defaultSocialMedia.forEach(social => this.createSocialMedia(social));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Settings methods
  async getSettings(): Promise<Settings | undefined> {
    return this.settings;
  }

  async updateSettings(settingsData: InsertSettings): Promise<Settings> {
    const updatedSettings: Settings = {
      id: 1,
      profileImageUrl: settingsData.profileImageUrl,
      profileName: settingsData.profileName,
      profileAge: settingsData.profileAge,
      whatsappUrl: settingsData.whatsappUrl,
      backgroundAudioUrl: settingsData.backgroundAudioUrl || null,
      statusTexts: settingsData.statusTexts
    };
    this.settings = updatedSettings;
    return this.settings;
  }

  // Friends methods
  async getFriends(): Promise<Friend[]> {
    return Array.from(this.friends.values()).sort((a, b) => a.order - b.order);
  }

  async createFriend(friendData: InsertFriend): Promise<Friend> {
    const id = this.currentFriendId++;
    const order = Array.from(this.friends.values()).length + 1;
    const friend: Friend = { ...friendData, id, order };
    this.friends.set(id, friend);
    return friend;
  }

  async updateFriend(id: number, friendData: Partial<InsertFriend>): Promise<Friend | undefined> {
    const existing = this.friends.get(id);
    if (!existing) return undefined;
    
    const updated: Friend = { ...existing, ...friendData };
    this.friends.set(id, updated);
    return updated;
  }

  async deleteFriend(id: number): Promise<boolean> {
    return this.friends.delete(id);
  }

  // Projects methods
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => a.order - b.order);
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const order = Array.from(this.projects.values()).length + 1;
    const project: Project = { ...projectData, id, order };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, projectData: Partial<InsertProject>): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;
    
    const updated: Project = { ...existing, ...projectData };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Social media methods
  async getSocialMedia(): Promise<SocialMedia[]> {
    return Array.from(this.socialMediaList.values()).sort((a, b) => a.order - b.order);
  }

  async createSocialMedia(socialMediaData: InsertSocialMedia): Promise<SocialMedia> {
    const id = this.currentSocialMediaId++;
    const order = Array.from(this.socialMediaList.values()).length + 1;
    const socialMedia: SocialMedia = { ...socialMediaData, id, order };
    this.socialMediaList.set(id, socialMedia);
    return socialMedia;
  }

  async updateSocialMedia(id: number, socialMediaData: Partial<InsertSocialMedia>): Promise<SocialMedia | undefined> {
    const existing = this.socialMediaList.get(id);
    if (!existing) return undefined;
    
    const updated: SocialMedia = { ...existing, ...socialMediaData };
    this.socialMediaList.set(id, updated);
    return updated;
  }

  async deleteSocialMedia(id: number): Promise<boolean> {
    return this.socialMediaList.delete(id);
  }
}

export const storage = new MemStorage();
