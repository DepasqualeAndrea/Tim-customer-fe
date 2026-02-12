export class NavbarMenu {
  id?: string;
  name: string;
  route: string;
  children?: NavbarMenu[];
}

export type LoggedMenuItem = {
  id: number;
  isActive: boolean;
  isExternalLink: boolean;
  name: string;
  route: string;
}

export type NavbarMenuItem = {
  name: string;
  route: string;
  children: Omit<NavbarMenuItem, 'children'> | null
}