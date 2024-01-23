// import { Resend } from "resend";
// import getSession from "@/supabase/getSession";
// import NotifyUpdateTemplate from "./TestNewUpdate.template";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const notifyNewUpdate = async (updateId) => {
//   const { supabase } = await getSession();

//   const { data: update } = await supabase
//   .from("updates")
//   .select("*, update_type (*), created_by (*), request(*)")
//   .eq("id", updateId)
//   .single()





//   console.log(update)


//   const { data: respondGroupMember}  = await supabase.from("respond_group_members")
//   .select("*")
//   .eq("respond_group", update.request.to)
//   .single()
  
//   const { data: groupMembers}  = await supabase.from("group_members")
//   .select("user(email)")
//   .eq("group", respondGroupMember.group)
  
//   const receipients = [update.created_by.email, ...groupMembers.map(({ user : { email }}) => { return email })]
//   console.log(receipients)

//   const data = await resend.emails.send({
//     from: "Acme <onboarding@resend.dev>",
//     to: receipients,
//     subject: "New Update",
//     react: NotifyUpdateTemplate({ update }),
//     // text: "mail test"
//   });

//   // console.log(data);
// };

// export const notifyNewRequest = async () => {
//   const data = await resend.emails.send({
//     from: "Acme <onboarding@resend.dev>",
//     to: ["minhpg@gmail.com"],
//     subject: "Hello world",
//     //   react: EmailTemplate({ firstName: "John" }),
//     text: "mail test",
//   });

//   console.log(data);
// };

// export const notifyNewUser = async () => {
//   const data = await resend.emails.send({
//     from: "Acme <onboarding@resend.dev>",
//     to: ["minhpg@gmail.com"],
//     subject: "Hello world",
//     //   react: EmailTemplate({ firstName: "John" }),
//     text: "mail test",
//   });

//   console.log(data);
// };
