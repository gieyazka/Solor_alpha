import axios from "axios";
import { getEventByDate } from "./event";
import dayjs from "dayjs";
// U2091822f75cd6222b3b15e73e19e5879   // AS
//Uf5ad20aeae32717cc15c1f7545105fe3  //Ky
const userIds = [
  "Uf5ad20aeae32717cc15c1f7545105fe3",
  "U2091822f75cd6222b3b15e73e19e5879",
];

const { CHANNEL_ACCESS_TOKEN } = process.env;
export const sendMessageToLine = async (
  data: Awaited<ReturnType<typeof getEventByDate>>[0]
) => {
  try {
    const schoolData = data?.master_data;
    const flexMessage = {
      type: "flex",
      altText: `📍 นัดหมาย: ${schoolData?.school_name || "โรงเรียน"}`,
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: `📍 ${schoolData?.school_name || "-"}`,
              weight: "bold",
              size: "lg",
              wrap: true,
            },
            {
              type: "box",
              layout: "vertical",
              spacing: "xs",
              contents: [
                {
                  type: "text",
                  text: `👤 ผู้ประสานงาน: ${
                    schoolData?.contact_school || "-"
                  } (${schoolData?.contact_position || "-"})`,
                  wrap: true,
                  size: "sm",
                },
                {
                  type: "text",
                  text: `📞 เบอร์โทร: ${schoolData?.contact_phone || "-"}`,
                  wrap: true,
                  size: "sm",
                },
                {
                  type: "text",
                  text: `👨‍🏫 ผู้อำนวยการ: ${
                    schoolData?.director_school || "-"
                  } (${schoolData?.director_phone || "-"})`,
                  wrap: true,
                  size: "sm",
                },
              ],
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
                      ? dayjs(data.date).format("DD MMMM YYYY เวลา HH:mm")
                      : "-"
                  }`,
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

    for (const userId of userIds) {
      const response = await axios.post(
        "https://api.line.me/v2/bot/message/push",
        {
          to: userId,
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
    }
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ ส่งข้อความล้มเหลว",
      error.response?.data || error.message
    );
  }
};
