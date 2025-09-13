"use server";
import axios from "axios";
import dayjs from "@/utils/dayjs";
import { eventProps } from "@/@type";
import _ from "lodash";
// U2091822f75cd6222b3b15e73e19e5879   // AS
//Uf5ad20aeae32717cc15c1f7545105fe3  //Ky
const userIds = [
  "Uf5ad20aeae32717cc15c1f7545105fe3",
  "U2091822f75cd6222b3b15e73e19e5879",
];
const groupId = `C5f5888f6c1097344e34a10bec4f7d37d`; //กลุ่มจริง
// const groupId = `Uf5ad20aeae32717cc15c1f7545105fe3`;
const { CHANNEL_ACCESS_TOKEN } = process.env;
export const sendMessageToLine = async (data: Partial<eventProps>) => {
  // console.log("data", data);

  try {
    const schoolData = data?.schoolData;
    const phone = (schoolData?.["school_contact_phone"] || "-").replace(
      /-/g,
      ""
    );

    const flexMessage = {
      type: "flex",
      altText: `📍 นัดหมาย: ${schoolData?.["school_name"] || "โรงเรียน"}`,
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",

          spacing: "md",
          contents: [
            {
              type: "text",
              text: `📍 ${schoolData?.["school_name"] || "-"}`,
              weight: "bold",
              size: "lg",
              wrap: true,
            },

            {
              type: "text",
              text: `👤 ผู้ประสานงาน: ${
                schoolData?.["school_contact_name"] || "-"
              } (${schoolData?.["school_contact_position"] || "-"})`,
              wrap: true,
              size: "sm",
            },

            {
              type: "text",
              text:
                phone === "-"
                  ? "-"
                  : `📞 เบอร์โทร: ${
                      schoolData?.[`school_contact_phone`] || "-"
                    }`,
              wrap: true,
              size: "sm",
              weight: "bold",
              // color: "#1DB446",
              align: "start", // ชิดซ้าย
              action:
                phone === "" || _.isEmpty(phone)
                  ? undefined
                  : {
                      type: "uri",
                      label: phone,
                      uri: `tel:${phone}`,
                    },
            },
            {
              type: "text",
              text: `👨‍🏫 ผู้อำนวยการ: ${
                schoolData?.["school_director"] || "-"
              } (${schoolData?.["school_director_phone"] || "-"})`,
              wrap: true,
              size: "sm",
              weight: "bold",
              // color: "#1DB446",
              align: "start", // ชิดซ้าย
            },

            {
              type: "separator",
              margin: "md",
            },
            {
              type: "box",
              layout: "vertical",
              spacing: "xs",
              contents: [
                {
                  type: "text",
                  text: `📅 ${data?.title || "-"}`,
                  weight: "bold",
                  wrap: true,
                  size: "md",
                },
                {
                  type: "text",
                  text: `🗓 วันเวลา: ${
                    data?.date
                      ? dayjs(data.date)
                          .add(7, "hour")
                          .format("DD MMMM YYYY เวลา HH:mm")
                      : "-"
                  }`,
                  wrap: true,
                  size: "sm",
                },
                {
                  type: "text",
                  text: `👤 Team : ${data.team}`,
                  wrap: true,
                  size: "sm",
                },
                ...(data?.description
                  ? [
                      {
                        type: "text",
                        text: `📝 ${data.description || "-"}`,
                        wrap: true,
                        size: "sm",
                        color: "#888888",
                      },
                    ]
                  : []),
              ],
            },
          ],
        },
        styles: {
          body: {
            backgroundColor: "#f6f6f6",
          },
        },
      },
    };

    // for (const userId of userIds) {
    const response = await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: groupId,
        messages: [flexMessage],
      },
      {
        headers: {
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ ส่งข้อความสำเร็จ", response.status);
    // }
    return "success";
  } catch (error: any) {
    console.error(
      "❌ ส่งข้อความล้มเหลว",
      error.response?.data || error.message
    );
  }
};
