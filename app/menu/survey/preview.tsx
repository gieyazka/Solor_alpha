import { useWatch, Control } from "react-hook-form";
import { useEffect, useMemo } from "react";

type WithPhotos = { photos?: File };

type WithPhotosArray = { photos: File[] };

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
): string[][] {
  // subscribe deep changes ในแต่ละ item.photos (ซึ่งเป็น File[])
  const items = useWatch({
    control,
    name: fieldName as any,
    defaultValue: [] as any,
  }) as WithPhotosArray[];

  // สร้าง URL ใหม่เป็น nested array [ [url1, url2], [url1], … ]
  const previews = useMemo(() => {
    return items.map(
      (item) => item.photos?.map((f) => URL.createObjectURL(f)) ?? []
    );
  }, [items]);

  // cleanup เมื่อ unmount หรือ items เปลี่ยน
  useEffect(() => {
    return () => {
      previews.flat().forEach((u) => u && URL.revokeObjectURL(u));
    };
  }, [previews]);

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
  }) as File[];

  const previews = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((u) => u && URL.revokeObjectURL(u));
    };
  }, [previews]);

  return previews;
}
