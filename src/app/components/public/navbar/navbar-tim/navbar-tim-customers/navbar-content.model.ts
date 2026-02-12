export type NavbarTimCustomersModel = {
  logo: Logo;
  privateAreaLabel: string
  accessAreaLabel: string
  preNavbar: PreNavbarItem[];
}

type Logo = {
  image: string;
  link: string;
}

type PreNavbarItem = {
  title: string;
  link: string;
}