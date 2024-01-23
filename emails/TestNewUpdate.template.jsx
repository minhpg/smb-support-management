import {
  Html,
  Body,
  Link,
  Text,
  Button,
  Container,
  Head,
  Preview,
  Section,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

const NotifyUpdateTemplate = ({ update }) => {
  return (
    <Html>
      <Head />
      <Preview>New Update</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="px-4 py-6 h-[500px]">
            <Container>
              <Link href="/dashboard">
                <div>
                  {/* <Img src={logo}  width={44} height={48}/> */}
                  <div className="text-black">
                    <div className="font-semibold flex justify-center">
                      MapleBear
                      <div className="text-red-600">Sunshine</div>
                    </div>
                    <div className="text-black text-sm font-light">
                      Canadian School
                    </div>
                  </div>
                </div>
              </Link>
            </Container>
            <Container>
              <Container className="text-center mt-3">
                <Text>
                  <div className="text-xl font-bold">
                    New Update - {update.update_type.title}
                    <div className="text-sm font-light opacity-70">
                      at {new Date(update.created_at).toLocaleString()}
                    </div>
                  </div>
                </Text>
              </Container>
              <div className="mt-3">
                <div className="text-base font-semibold">From</div>
                <div className="text-sm text-blue-600 underline">
                  {update.created_by.first_name} {update.created_by.last_name} -{" "}
                  {update.created_by.email}
                </div>
              </div>
              {update.update_type.requires_deadline && (
                <div className="mt-3">
                  <div className="text-base font-semibold">
                    Expected deadline
                  </div>
                  <div className="text-sm font-light">
                    {new Date(update.deadline).toLocaleDateString()}
                  </div>
                </div>
              )}
              {update.update_type.attach_text && (
                <div className="mt-3">
                  <div className="text-base font-semibold">Notes</div>
                  <div className="text-sm font-light">{update.text}</div>
                </div>
              )}
              <Section className="mt-10 flex justify-center">
                <Button
                  className="text-base text-blue-600"
                  href={`/dashboard/requests/${update.request}`}
                >
                  <div className="underline">View update</div>
                </Button>
              </Section>
            </Container>
            <Text className="text-xs font-light opacity-70 text-center">
              Sent via <code>smb-support-management</code> application
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NotifyUpdateTemplate;
