import { AppwriteType, SurveyBuilding } from "@/@type";
import { createClientAppwrite } from "@/utils/appwrite_client";
import { ID } from "appwrite";
import pMap from "p-map";
import { StructureFormValues } from "./dialog";

export const formatCabinet = async (data: {
  zeroExportCabinet: {
    name: string;
    photos?: File;
  }[];
  solarCellCabinet: {
    name: string;
    photos?: File;
  }[];
}) => {
  const zeroCabinetsRaw = data.zeroExportCabinet
    .filter((c) => c.name !== "")
    .map((d) => ({
      cabinet: d.name,
      image: d.photos,
      type: "zeroExport" as const,
    }));
  // สร้างรายการ solarCell
  const solarCabinets = data.solarCellCabinet
    .filter((c) => c.name !== "")
    .map((d) => ({
      cabinet: d.name,
      image: d.photos,
      type: "solarCell" as const,
    }));

  // รวมสองชุดเป็น array เดียว
  const cabinetsRaw: { cabinet: string; image?: File; type: string }[] = [
    ...zeroCabinetsRaw,
    ...solarCabinets,
  ];
  const { storage } = await createClientAppwrite();

  const cabinets = await pMap(
    cabinetsRaw,
    async ({ cabinet, image, type }) => {
      // upload แล้วได้ fileId กลับมา
      if (!image)
        return {
          cabinet,
          image: [], // เก็บ fileId แทน File object
          type,
        };
      const uploaded = await storage.createFile(
        process.env.NEXT_PUBLIC_BUCKET_SOLAR!,
        ID.unique(),
        image as File
      );
      return {
        cabinet,
        image: uploaded ? [uploaded.$id] : [],
        type,
      };
    },
    { concurrency: 3 }
  );
  return cabinets;
};
export const formatSolarCellInstall = async (data: {
  solarCellBuiling: {
    name: string;
    photos?: File[];
  }[];
}) => {
  const solarCabinets = data.solarCellBuiling
    .filter((c) => c.name !== "")
    .map((d) => ({
      name: d.name,
      image: d.photos,
    }));

  // รวมสองชุดเป็น array เดียว

  const { storage } = await createClientAppwrite();

  const solarInstall = await pMap(
    solarCabinets,
    async ({ name, image }) => {
      // upload แล้วได้ fileId กลับมา
      if (!image)
        return {
          name,
          image: [], // เก็บ fileId แทน File object
        };
      const uploaded = await pMap(image, async (file) => {
        const uploaded = await storage.createFile(
          process.env.NEXT_PUBLIC_BUCKET_SOLAR!,
          ID.unique(),
          file as File
        );
        return uploaded.$id;
      });
      return {
        name,
        image: uploaded || [],
      };
    },
    { concurrency: 3 }
  );
  return solarInstall;
};

export const formatBuilding = (building: StructureFormValues[]) => {
  const data: Partial<SurveyBuilding>[] = building?.map((d) => {
    return {
      building_name: d.buildingName,
      roof_type_roman: d.roofTypes.roman.checked,
      roof_type_roman_age: d.roofTypes.roman.age,
      roof_type_cpac: d.roofTypes.cpac.checked,
      roof_type_cpac_age: d.roofTypes.cpac.age,
      roof_type_prestige: d.roofTypes.prestige.checked,
      roof_type_prestige_age: d.roofTypes.prestige.age,
      roof_type_slab: d.roofTypes.slab.checked,
      roof_type_slab_age: d.roofTypes.slab.age,
      roof_type_metalsheet: d.roofTypes.metalSheet.checked,
      roof_type_metalsheet_age: d.roofTypes.metalSheet.age,
      roof_type_other: d.roofTypes.other.checked,
      roof_type_other_age: d.roofTypes.other.age,
      roof_type_other_label: d.roofTypes.other.otherLabel,
      area: d.area,
      slope_degree: d.slopeDegree,
      shapes_open_gable: d.shapes.open_gable,
      shapes_box_gable: d.shapes.box_gable,
      shapes_hip: d.shapes.hip,
      shapes_flat: d.shapes.flat,
      shapes_dutch_gable: d.shapes.dutch_gable,
      shapes_saltbox: d.shapes.saltbox,
      shapes_dormer: d.shapes.dormer,
      shapes_shed: d.shapes.shed,
      shapes_m_shaped: d.shapes.m_shaped,
      shapes_pyramid_hip: d.shapes.pyramid_hip,
      shapes_clerestory: d.shapes.clerestory,
      metalsheet_CR_700KL: d.metalProfiles.cr_700kl,
      metalsheet_CR_750BL: d.metalProfiles.cr_750bl,
      metalsheet_CR_750W: d.metalProfiles.cr_750w,
      metalsheet_CR_600W: d.metalProfiles.cr_600w,
      metalsheet_CR_650BL: d.metalProfiles.cr_650bl,
      pitch: d.pitch,
      structure_wood: d.structure.wood.checked,
      structure_wood_type: d.structure.wood.type,
      structure_wood_age: d.structure.wood.age,
      structure_steel: d.structure.steel.checked,
      structure_steel_type: d.structure.steel.type,
      structure_steel_age: d.structure.steel.age,
      purlin_purlin: d.purlin_purlin,
      rafter_rafter: d.rafter_rafter,
      pillar_pillar: d.pillar_pillar,
      skylight_purlin: d.skylight_purlin,
      width_roof_one: d.widthEave1,
      width_roof_two: d.widthEave2,
      lightning_protector: d.lightningProtector,
      ladder: d.ladder,
      jack_roof: d.jackRoof,
      turbine: d.turbine,
      remark: d.otherNotes,
    };
  });
  return data;
};

export const formatTransformer = (
  transformer: {
    location: string;
    meter: string;
  }[]
) => {
  return transformer.filter((t) => t.location !== "" || t.meter !== "");
};

export const formatUserBehavior = (
  userBehavior: {
    meter: string;
    building: string;
    amount: string;
  }[]
) => {
  return userBehavior
    .filter((u) => u.meter !== "" || u.building !== "" || u.amount !== "")
    .map((u) => ({
      meter_type: u.meter,
      building: u.building,
      average_electric: parseFloat(u.amount),
    }));
};

export const formatTopviewImage = async (image: File[] | undefined) => {
  if (!image) return [];
  const { storage } = await createClientAppwrite();
  const uploaded = await pMap(image, async (file) => {
    const uploaded = await storage.createFile(
      process.env.NEXT_PUBLIC_BUCKET_SOLAR!,
      ID.unique(),
      file as File
    );
    return uploaded.$id;
  });
  return uploaded;
};
export const formatBottomViewImage = async (image: File[] | undefined) => {
  if (!image) return [];
  const { storage } = await createClientAppwrite();
  const uploaded = await pMap(image, async (file) => {
    const uploaded = await storage.createFile(
      process.env.NEXT_PUBLIC_BUCKET_SOLAR!,
      ID.unique(),
      file as File
    );
    return uploaded.$id;
  });
  return uploaded || [];
};

export const datatoFormBuliding = (
  building: AppwriteType<SurveyBuilding>[] | undefined
) => {
  try {
    const formatBuildingData: StructureFormValues[] = building
      ? building.map((d) => ({
          docId: d.$id,
          buildingName: d.building_name || "",
          roofTypes: {
            roman: {
              checked: !!d.roof_type_roman,
              age: d.roof_type_roman_age ?? 0,
            },
            cpac: {
              checked: !!d.roof_type_cpac,
              age: d.roof_type_cpac_age ?? 0,
            },
            prestige: {
              checked: !!d.roof_type_prestige,
              age: d.roof_type_prestige_age ?? 0,
            },
            slab: {
              checked: !!d.roof_type_slab,
              age: d.roof_type_slab_age ?? 0,
            },
            metalSheet: {
              checked: !!d.roof_type_metalsheet,
              age: d.roof_type_metalsheet_age ?? 0,
            },
            other: {
              checked: !!d.roof_type_other,
              age: d.roof_type_other_age ?? 0,
              otherLabel: d.roof_type_other_label ?? "",
            },
          },
          area: d.area ?? 0,
          slopeDegree: d.slopeDegree || [],

          shapes: {
            open_gable: d.shapes_open_gable || false,
            box_gable: d.shapes_box_gable || false,
            hip: d.shapes_hip || false,
            flat: d.shapes_flat || false,
            dutch_gable: d.shapes_dutch_gable || false,
            saltbox: d.shapes_saltbox || false,
            dormer: d.shapes_dormer || false,
            shed: d.shapes_shed || false,
            m_shaped: d.shapes_m_shaped || false,
            pyramid_hip: d.shapes_pyramid_hip || false,
            clerestory: d.shapes_clerestory || false,
          },

          metalProfiles: {
            cr_700kl: d.metalsheet_CR_700KL || false,
            cr_750bl: d.metalsheet_CR_750BL || false,
            cr_750w: d.metalsheet_CR_750W || false,
            cr_600w: d.metalsheet_CR_600W || false,
            cr_650bl: d.metalsheet_CR_650BL || false,
          },
          pitch: d.pitch || 0,
          structure: {
            wood: {
              checked: d.structure_wood || false,
              type: d.structure_wood_type || [],
              age: d.structure_wood_age || 0,
            },
            steel: {
              checked: d.structure_steel || false,
              type: d.structure_steel_type || [],
              age: d.structure_steel_age || 0,
            },
          },
          purlin_purlin: d.purlin_purlin || 0,
          rafter_rafter: d.rafter_rafter || 0,
          pillar_pillar: d.pillar_pillar || 0,
          skylight_purlin: d.skylight_purlin || 0,
          widthEave1: d.width_roof_one || 0,
          widthEave2: d.width_roof_two || 0,
          lightningProtector: d.lightning_protector || false,
          ladder: d.ladder || false,
          jackRoof: d.jackRoof || false,
          turbine: d.turbine || false,
          otherNotes: d.remark || "",
        }))
      : [];
    return formatBuildingData;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const formatUrlImage = (imageId: string[]) => {
  return imageId.map((d) => {
    return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_SOLAR}/files/${d}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}&mode=admin`;
  });
};
