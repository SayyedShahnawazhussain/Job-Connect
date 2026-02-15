
export enum UserRole {
  CANDIDATE = 'CANDIDATE',
  EMPLOYER = 'EMPLOYER',
  ADMIN = 'ADMIN'
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  REJECTED = 'REJECTED',
  HIRED = 'HIRED'
}

export enum InterviewMode {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE'
}

export enum JobStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  companyName?: string;
  companyLogo?: string;
  profilePic?: string;
  resumeUrl?: string;
  skills?: string[];
  location?: string;
  bio?: string;
  website?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  teamPhotos?: string[];
  cultureDescription?: string;
}

export interface Job {
  id: string;
  employerId: string; // Acts as ownerId
  companyName: string;
  companyLogo?: string;
  title: string;
  location: string;
  salary: string;
  skills: string[];
  description: string;
  postedAt: string;
  updatedAt: string;
  type: string;
  status: JobStatus;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  appliedDate: string;
  candidateName: string;
  jobTitle: string;
  interviewDetails?: Interview;
}

export interface Interview {
  id: string;
  applicationId: string;
  date: string;
  time: string;
  mode: InterviewMode;
  locationLink: string;
  name: string;
  notes: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}
