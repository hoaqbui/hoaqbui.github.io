export type Profile = { name: string; roleLine: string; headline: string; email: string; linkedin: string; resumePath: string; vcardPath: string; openTo: string; quote: { text: string; by: string } };
export const profile: Profile = {
  name: "Hoa Bui",
  roleLine: "Senior Technical Product Manager · AI creative tools · Los Angeles",
  headline: "Technologist with a creative background, helping move AI forward.",
  email: "hoaqbui@gmail.com",
  linkedin: "https://www.linkedin.com/in/hoaqbui/",
  resumePath: "/hoa-bui-resume.pdf",
  vcardPath: "/hoa-bui.vcf",
  openTo: "Open to senior PM / TPM roles in gen-AI creative tools.",
  quote: { text: "You didn’t just make us faster, you changed everything.", by: "Principal game designer, Riot" },
};
