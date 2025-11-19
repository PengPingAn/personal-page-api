interface Job {
  desc: string;
  item: string[];
}

interface Contact {
  icon: string;
  label: string;
  url: string;
}

interface Location {
  country: string;
  city: string;
  region: string;
  Motto: string;
}

export interface UserProfile {
  name: string;
  occupation: string;
  job: Job;
  introduction: string;
  contact: Contact[];
  location: Location;
  sponsorshipUrls: string[];
  particleImage: string;
}
