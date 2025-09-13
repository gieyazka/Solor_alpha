import { useWatch, Control } from "react-hook-form";
import { useEffect, useMemo, useRef } from "react";
import _ from "lodash";

type WithPhotos = { photos?: File };

type WithPhotosArray = { photos: File[]; image: [] };

export function usePreviews<FormValues extends Record<string, any>>(
  control: Control<FormValues>,
  fieldName: keyof FormValues
): string[] {
  // 1) subscribe ให้ React-Hook-Form re-render เมื่อค่าลึกๆ เปลี่ยน
  const items = useWatch({
    control,
    name: fieldName as any,
  }) as WithPhotos[];

  // 2) สร้าง array ใหม่ทุกครั้งที่ items เปลี่ยน
  const previews = useMemo(
    () =>
      items.map((item) =>
        item.photos ? URL.createObjectURL(item.photos) : ""
      ),
    [items]
  );

  // 3) cleanup เมื่อ previews เปลี่ยนหรือ unmount
  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  return previews;
}
export function usePreviewsArr<FormValues extends Record<string, any>>(
  control: Control<FormValues>,
  fieldName: keyof FormValues
): Array<{ photos: string[]; image?: string[] }> {
  // อ่านค่าล่าสุดจาก form
  const items = useWatch({
    control,
    name: fieldName as any,
    defaultValue: [] as any,
  }) as WithPhotosArray[];

  // สร้าง preview URLs ขึ้นมาใหม่เมื่อ items เปลี่ยน
  const previews = useMemo(
    () =>
      items.map((item) => ({
        photos: item.photos?.map((f) => URL.createObjectURL(f)) ?? [],
        image: item.image ?? [],
      })),
    [items]
  );

  // เก็บ URL ชุดก่อนหน้า เพื่อ revoke ทิ้งก่อนสร้างใหม่
  const previousUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    // แบนด์ลิงก์ URL ของ previews ปัจจุบัน
    const currentUrls = previews.flatMap((p) => p.photos);

    // revoke URL ของเดิมก่อน
    previousUrlsRef.current.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    // อัปเดต ref ให้เก็บชุดล่าสุด
    previousUrlsRef.current = currentUrls;
  }, [previews]);

  // คืนค่า cleanup สุดท้ายตอน unmount
  useEffect(() => {
    return () => {
      previousUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  return previews;
}

export function usePreviewsSimple<FormValues extends Record<string, any>>(
  control: Control<FormValues>,
  fieldName: keyof FormValues
): string[] {
  const files = useWatch({
    control,
    name: fieldName as any,
    defaultValue: [] as any,
  }) as File[] | string[];

  const previews = useMemo(
    () =>
      files.map((f) => {
        if (_.isString(f)) {
          return f;
        } else {
          return URL.createObjectURL(f);
        }
      }),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((u) => {
        if (u && !_.isString(u)) {
          URL.revokeObjectURL(u);
        }
      });
    };
  }, [previews]);

  return previews;
}
