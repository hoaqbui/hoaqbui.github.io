export type Profile = { name: string; roleLine: string; headline: string; subLine: string; email: string; linkedin: string; resumePath: string; vcardPath: string; openTo: string; quote: { text: string; by: string } };
export const profile: Profile = {
  name: "Hoa Bui",
  roleLine: "Creative and technology leader · Senior Technical PM · Los Angeles",
  headline: "I build the tools artists use. Now with AI.",
  subLine: "19 years of pipelines and tools at Lucasfilm, Pixar and Riot Games.",
  email: "hoaqbui@gmail.com",
  linkedin: "https://www.linkedin.com/in/hoaqbui/",
  resumePath: "https://docs.google.com/document/d/1s-OGEpBgFRViEk3mBTeSgL9CHzl-wdsOQKxoBNQtU7s/view",
  vcardPath: "/hoa-bui.vcf",
  openTo: "Open to Senior Product Manager and Senior Technical Product Manager roles in AI creative tools. Los Angeles.",
  quote: { text: "You didn’t just make us faster, you changed everything.", by: "Principal game designer, Riot" },
};
