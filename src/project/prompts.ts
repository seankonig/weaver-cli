import prompts from "prompts";

export async function promptForProjectDetails() {
  return await prompts([
    {
      type: "text",
      name: "description",
      message: "📝 What is this project about?",
      hint: "Short summary that helps define what you’re building.",
    },
    {
      type: "text",
      name: "goal",
      message: "🎯 What’s the main goal you want to accomplish?",
      hint: "This will help Weave break the project into tasks later.",
    },
    {
      type: "list",
      name: "tools",
      message: "🛠 Preferred tools or frameworks?",
      hint: "Separate with commas (e.g. Next.js, Supabase, Tailwind)",
      separator: ",",
    },
    {
      type: "list",
      name: "constraints",
      message: "⚠️  Any constraints, restrictions, or requirements?",
      hint: "e.g. No Firebase, must be serverless, use PostgreSQL",
      separator: ",",
    },
  ]);
}
