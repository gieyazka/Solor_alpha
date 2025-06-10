import axios from "axios";
import { getEventByDate } from "./event";
import dayjs from "@/utils/dayjs";
import { eventProps } from "@/@type";
// U2091822f75cd6222b3b15e73e19e5879   // AS
//Uf5ad20aeae32717cc15c1f7545105fe3  //Ky
const userIds = [
  "Uf5ad20aeae32717cc15c1f7545105fe3",
  "U2091822f75cd6222b3b15e73e19e5879",
];
// const groupId = `Ca919cff8a2de4b1981e48f836e8f877a`; //กลุ่มจริง
const groupId = `Uf5ad20aeae32717cc15c1f7545105fe3`;
const { CHANNEL_ACCESS_TOKEN } = process.env;
export const sendMessageToLine = async (data: eventProps) => {
  try {

    const schoolData = data?.schoolData;
    const phone = (schoolData?.["เบอร์ติดต่อผู้ประสานงาน"] || "-").replace(
      /-/g,
      ""
    );
    const director_phone = (schoolData?.["เบอร์ติดต่อ ผอ."] || "-").replace(
      /-/g,
      ""
    );

    const flexMessage = {
      type: "flex",
      altText: `📍 นัดหมาย: ${schoolData?.["ชื่อโรงเรียน"] || "โรงเรียน"}`,
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",

          spacing: "md",
          contents: [
            {
              type: "text",
              text: `📍 ${schoolData?.["ชื่อโรงเรียน"] || "-"}`,
              weight: "bold",
              size: "lg",
              wrap: true,
            },

            {
              type: "text",
              text: `👤 ผู้ประสานงาน: ${
                schoolData?.["ชื่อผู้ประสานงานโรงเรียน"] || "-"
              } (${schoolData?.["ตำแหน่ง"] || "-"})`,
              wrap: true,
              size: "sm",
            },

            {
              type: "text",
              text:
                phone === "-"
                  ? "-"
                  : `📞 เบอร์โทร: ${schoolData?.[`เบอร์ติดต่อผู้ประสานงาน`]}`,
              wrap: true,
              size: "sm",
              weight: "bold",
              // color: "#1DB446",
              align: "start", // ชิดซ้าย
              action:
                phone === "-"
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
                schoolData?.["ชื่อผู้อำนวยการโรงเรียน"] || "-"
              } (${schoolData?.["เบอร์ติดต่อ ผอ."] || "-"})`,
              wrap: true,
              size: "sm",
              weight: "bold",
              // color: "#1DB446",
              align: "start", // ชิดซ้าย
              // action:
              //   director_phone === "-"
              //     ? undefined
              //     : {
              //         type: "uri",
              //         label:
              //           director_phone &&
              //           director_phone.split("ต่อ")[0]?.replace(/ /g, ""),
              //         uri: `tel:${director_phone
              //           .split("ต่อ")[0]
              //           ?.replace(/ /g, "")}`,
              //       },
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
                        text: `📝 ${data.description}`,
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
