"use client";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { SchoolAutoComplete } from "../form/page";
import { useSchoolStore } from "@/stores";
import {
  SchoolData,
  SchoolProps,
  survey,
  SurveyBuilding,
  surveyCabinet,
  surveySolarInstall,
  surveyTransformer,
  surveyUserBehavior,
} from "@/@type";
import { inputClasses, labelClasses, sectionClasses } from "@/utils/style";
import clsx from "clsx";
import { CheckCircle, Delete, Edit, Edit2, X } from "lucide-react";
import { Add, Close, Details } from "@mui/icons-material";
import StructureModal, { StructureFormValues } from "./dialog";
import { use, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { usePreviews, usePreviewsArr, usePreviewsSimple } from "./preview";
import {
  createSurvey,
  createSurveyBuilding,
  createSurveyCabinet,
  createSurveySolarInstall,
  createSurveyTransformer,
  createSurveyUserBehavior,
  deleteSurveyCabinet,
  deleteSurveySolarInstall,
  deleteSurveyTransformer,
  deleteSurveyUserBehavior,
  updateSurvey,
  updateSurveyBuilding,
  updateSurveyCabinet,
  updateSurveySolarInstall,
  updateSurveyTransformer,
  updateSurveyUserBehavior,
} from "@/lib/survay.actions";
import { ID, Models } from "appwrite";
import { createClientAppwrite } from "@/utils/appwrite_client";
import pMap from "p-map";
import {
  datatoFormBuliding,
  formatBottomViewImage,
  formatBuilding,
  formatCabinet,
  formatSolarCellInstall,
  formatTopviewImage,
  formatTransformer,
  formatUrlImage,
  formatUserBehavior,
} from "./fn";
import { useSurveyQuery } from "@/actions/useQuery";
import dayjs from "dayjs";
import { deleteSurveyBuilding } from "../../../lib/survay.actions";
import { deleteImageSolar } from "@/lib/storage.action";
import Swal from "sweetalert2";
import { editSurvey } from "./edit.action";
const extractFileId = (s: string) => {
  const str = String(s).trim();
  // จับค่าหลัง /files/ ก่อนจะเจอ / หรือ ? หรือจบสตริง
  const m = str.match(/\/files\/([a-zA-Z0-9]+)(?=\/|\?|$)/);
  // ถ้าไม่ใช่ URL ให้ถือว่าเป็น id ตรง ๆ
  return m ? m[1] : str.startsWith("http") ? "" : str;
};
export type FormData = {
  // Section 0
  schoolName: string;
  address: string;
  schoolLocation: string;
  kwp: number;
  contactName: string;
  contactPhone: string;
  surveyor: string;
  userBehavior: {
    meter: string;
    building: string;
    amount: string;
    docId?: string;
  }[];
  transformerAmount: number;
  transformer: { location: string; meter: string; docId?: string }[];
  gps: string;
  capacity: string;
  coordinator: string;
  // Section 1
  billCase1: string;
  billCase2Meter1: string;
  billCase2Meter2: string;
  // Section 2
  // gridProviderMEA: boolean;
  gridProvider: string;
  // gridProviderPEA: boolean;
  // Section 3
  building: ({ docId?: string } & StructureFormValues)[];
  docsReceived: {
    roofplan: boolean;
    buildingplan: boolean;
    elecplan: boolean;
    monthlybill: boolean;
    loadprofile: boolean;
  };
  remark: string;
  voltageLevel: boolean[];
  transformerCount: number;

  zeroExportCabinet: {
    name: string;
    photos?: File;
    imageId?: string;
    image?: string;
    docId?: string;
  }[];
  solarCellCabinet: {
    name: string;
    photos?: File;
    imageId?: string;
    image?: string;
    docId?: string;
  }[];
  solarCellBuiling: {
    name: string;
    photos?: File[];
    imageId?: string[];
    image?: string[];
    docId?: string;
  }[];
  topviewImage?: File[] | string[];
  bottomViewImage?: File[] | string[];

  // etc...
};
const voltageoptions = [
  { label: "230V (1 Phase)", value: "230V (1 Phase)" },
  { label: "400V (3 Phase)", value: "400V (3 Phase)" },
  { label: "22KV", value: "22KV" },
  { label: "24KV", value: "24KV" },
  { label: "33KV", value: "33KV" },
  { label: "69KV", value: "69KV" },
  { label: "115KV", value: "115KV" },
];
export default function SurveyForm() {
  const masterStore = useSchoolStore();
  const surveyQuery = useSurveyQuery({ page: 1, size: 10 });
  const [openDialog, setOpenDialog] = useState<{
    open: boolean;
    data?: Models.Document & survey;
  }>({ open: false, data: undefined });

  const [isOpen, setIsOpen] = useState<{
    data?: StructureFormValues | undefined;
    index?: number | undefined;
    open: boolean;
  }>({
    data: undefined,
    index: undefined,
    open: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const { handleSubmit, control, reset, register, watch, setValue, getValues } =
    useForm<FormData>({
      defaultValues: {
        // initialize defaults if you like
        userBehavior: [
          {
            meter: "",
            building: "",
            amount: "",
          },
        ],
        transformer: [
          {
            location: "",
            meter: "",
          },
        ],
        kwp: 0,
        transformerCount: 0,
        gridProvider: "",
        // gridProviderMEA: false,
        // gridProviderPEA: false,
        voltageLevel: [],
        zeroExportCabinet: [{ name: "", photos: undefined }],
        solarCellCabinet: [{ name: "", photos: undefined }],
        solarCellBuiling: [{ name: "", photos: [] }],
      },
    });

  const userBehaviorArrForm = useFieldArray({
    control,
    name: "userBehavior",
  });
  const transformerArrForm = useFieldArray({
    control,
    name: "transformer",
  });

  const zeroExportCabinetArrForm = useFieldArray({
    name: "zeroExportCabinet",
    control,
  });
  const solarCellCabinetArrForm = useFieldArray({
    name: "solarCellCabinet",
    control,
  });
  const solarCellBuilingtArrForm = useFieldArray({
    name: "solarCellBuiling",
    control,
  });

  // ② useMemo ดูที่ zeroList (reference ใหม่ทุกครั้งที่ photos เปลี่ยน)
  const zeroPreviews = usePreviews(control, "zeroExportCabinet");
  const solarPreviews = usePreviews(control, "solarCellCabinet");
  const solarCellBuilingPreviews = usePreviewsArr(control, "solarCellBuiling");
  const topPreviews = usePreviewsSimple(control, "topviewImage");
  const bottomPreviews = usePreviewsSimple(control, "bottomViewImage");
  // ③ ล้าง URL เก่า
  useEffect(() => {
    return () => {
      zeroPreviews.forEach((u) => u && URL.revokeObjectURL(u));
      solarPreviews.forEach((u) => u && URL.revokeObjectURL(u));
    };
  }, [zeroPreviews, solarPreviews]);
  // console.log("openDialog", openDialog.data);
  useEffect(() => {
    if (openDialog.open && openDialog.data) {
      setValue("schoolName", openDialog.data.school_name);
      setValue("address", openDialog.data.location || "");
      setValue("gps", openDialog.data.gps || "");
      setValue("kwp", openDialog.data.kwp || 0);
      setValue("contactName", openDialog.data.contact_name || "");
      setValue("contactPhone", openDialog.data.contact_phone || "");
      setValue("surveyor", openDialog.data.surveyor || "");
      setValue("docsReceived", openDialog.data.docsReceived || "");
      setValue("remark", openDialog.data.remark || "");
      setValue("voltageLevel", openDialog.data.voltageLevel || "");
      setValue(
        "userBehavior",
        openDialog.data.behavior
          ? openDialog.data.behavior.map((d) => ({
              meter: d.meter_type || "",
              building: d.building || "",
              amount:
                d.average_electric !== undefined && d.average_electric !== null
                  ? String(d.average_electric)
                  : "",
              docId: d.$id,
            }))
          : []
      );
      setValue(
        "transformer",
        openDialog.data.transformer
          ? openDialog.data.transformer.map((d) => ({
              location: d.location || "",
              meter: d.meter || "",
              docId: d.$id,
            }))
          : []
      );
      const formatBuildingData = datatoFormBuliding(openDialog.data.building);
      setValue("building", formatBuildingData);
      setValue("transformerCount", openDialog.data.transformerCount || 0);
      setValue("gridProvider", openDialog.data.grid_provider || "");
      setValue("docsReceived.roofplan", openDialog.data.roofplan || false);
      setValue(
        "docsReceived.buildingplan",
        openDialog.data.buildingplan || false
      );
      setValue("docsReceived.elecplan", openDialog.data.elecplan || false);
      setValue(
        "docsReceived.monthlybill",
        openDialog.data.monthlybill || false
      );
      setValue(
        "docsReceived.loadprofile",
        openDialog.data.loadprofile || false
      );

      const zeroExport = openDialog.data.cabinet?.filter(
        (d) => d.type === "zeroExport"
      );
      const solarCell = openDialog.data.cabinet?.filter(
        (d) => d.type === "solarCell"
      );

      setValue(
        "zeroExportCabinet",
        zeroExport?.map((d) => {
          return {
            name: d.cabinet,
            image: d.image?.[0] ? formatUrlImage(d.image)[0] : undefined,
            imageId: d.image?.[0],
            docId: d.$id,
          };
        }) || []
      );

      setValue(
        "solarCellCabinet",
        solarCell?.map((d) => {
          return {
            name: d.cabinet,
            image: d.image?.[0] ? formatUrlImage(d.image)[0] : undefined,
            imageId: d.image?.[0],
            docId: d.$id,
          };
        }) || []
      );
      const solarCellBuiling = openDialog.data.install_solar?.map((d) => {
        return {
          name: d.name,
          image: d.image?.[0] ? formatUrlImage(d.image) : undefined,
          imageId: d.image,
          docId: d.$id,
        };
      });
      setValue("solarCellBuiling", solarCellBuiling);
      setValue(
        "topviewImage",
        openDialog.data.topview_image &&
          openDialog.data.topview_image?.length > 0
          ? formatUrlImage(openDialog.data.topview_image as string[])
          : []
      );
      setValue(
        "bottomViewImage",
        openDialog.data.bottomview_image
          ? formatUrlImage(openDialog.data.bottomview_image)
          : []
      );
    } else {
      reset();
    }
  }, [openDialog]);

  const onSubmit = async (data: FormData) => {
    if (openDialog.data !== undefined) {
      setIsSubmitting(true);
      try {
        await editSurvey(data, openDialog, setCurrentStep, setIsSubmitting);
        // const { storage } = await createClientAppwrite();

        // //update
        // // console.log("data", data);

        // const deleteBuilding = _.differenceWith(
        //   openDialog.data?.building,
        //   data.building,
        //   (a, b) => a.$id === b.docId
        // );

        // setCurrentStep("1/9: จัดข้อมูลพฤติกรรมผู้ใช้...");
        // console.time("1 section");

        // const deleteBehavior = _.differenceWith(
        //   openDialog.data?.behavior,
        //   data.userBehavior,
        //   (a, b) => a.$id === b.docId
        // ); //ok

        // const addBehavior = data.userBehavior.filter(
        //   (d) => d.docId === undefined
        // );

        // const updateBehavior = _.differenceWith(
        //   data.userBehavior.filter((t) => !!t.docId),
        //   deleteBehavior,
        //   (a, b) => String(a.docId).trim() === String(b.$id).trim()
        // );
        // // console.log("deleteBehavior", deleteBehavior);
        // // console.log("addBehavior", addBehavior);
        // // console.log("updateBehavior", updateBehavior);
        // const userBehavior = formatUserBehavior(addBehavior);

        // await Promise.all([
        //   await pMap(
        //     updateBehavior,
        //     async (behavior) => {
        //       const formatUpdateBehavior = formatUserBehavior([behavior]);
        //       // console.log("first", behavior);
        //       await updateSurveyUserBehavior({
        //         data: formatUpdateBehavior[0],
        //         behaviorId: behavior.docId!,
        //       });
        //     },
        //     { concurrency: 3 }
        //   ),
        //   await pMap(
        //     userBehavior,
        //     async (behavior) => {
        //       await createSurveyUserBehavior({
        //         data: behavior,
        //         surveyId: openDialog.data?.$id!,
        //       });
        //     },
        //     { concurrency: 3 }
        //   ),
        //   await pMap(
        //     deleteBehavior,
        //     async (behavior) => {
        //       await deleteSurveyUserBehavior({
        //         docId: behavior.$id,
        //       });
        //     },
        //     { concurrency: 3 }
        //   ),
        // ]);
        // console.timeEnd("1 section");

        // // console.log("deleteSolarCabinet", deleteSolarCabinet);
        // // console.log("addSolarCabinet", addSolarCabinet);

        // //2 transformerArrForm  พิกดหม้อแปลง
        // setCurrentStep("2/9: จัดข้อมูลหม้อแปลง...");
        // console.time("2 section");
        // const deleteTransformer = _.differenceWith(
        //   openDialog.data?.transformer,
        //   data.transformer,
        //   (a, b) => a.$id === b.docId
        // );
        // const addTransformer = data.transformer.filter(
        //   (d) => d.docId === undefined
        // );
        // // console.log("deleteTransformer", deleteTransformer);
        // // console.log("addTransformer", addTransformer);
        // const updateTransformer = _.differenceWith(
        //   data.transformer.filter((t) => !!t.docId),
        //   deleteTransformer,
        //   (a, b) => String(a.docId).trim() === String(b.$id).trim()
        // );
        // const formatAddTransformer = formatTransformer(addTransformer);
        // await Promise.all([
        //   await pMap(
        //     updateTransformer,
        //     async (transformer) => {
        //       const formatUpdateTransformer = formatTransformer([transformer]);
        //       await updateSurveyTransformer({
        //         data: formatUpdateTransformer[0],
        //         transformerId: transformer.docId!,
        //       });
        //     },
        //     { concurrency: 3 }
        //   ),
        //   await pMap(
        //     formatAddTransformer,
        //     async (transformer) => {
        //       await createSurveyTransformer({
        //         surveyId: openDialog.data?.$id!,
        //         data: transformer,
        //       });
        //     },
        //     { concurrency: 3 }
        //   ),
        //   await pMap(deleteTransformer, async (transformer) => {
        //     await deleteSurveyTransformer({ transformerId: transformer.$id });
        //   }),
        // ]);

        // console.timeEnd("2 section");

        // //3 building
        // setCurrentStep("3/9: จัดข้อมูลอาคาร...");
        // console.time("3 section");
        // //  UPDATE  อาคาร
        // const addBuilding = data.building.filter((d) => d.docId === undefined);

        // const buildingFormat = formatBuilding(addBuilding);

        // const updateBuilding = _.differenceWith(
        //   data.building.filter((t) => !!t.docId),
        //   deleteBuilding,
        //   (a, b) => String(a.docId).trim() === String(b.$id).trim()
        // );
        // await Promise.all([
        //   await pMap(
        //     updateBuilding,
        //     async (building) => {
        //       const formatUpdateBuilding = formatBuilding([building]);
        //       await updateSurveyBuilding({
        //         data: formatUpdateBuilding[0],
        //         buildingId: building.docId!,
        //       });
        //     },
        //     { concurrency: 3 }
        //   ),
        //   await pMap(
        //     buildingFormat,
        //     async (building) => {
        //       await createSurveyBuilding({
        //         surveyId: openDialog.data?.$id!,
        //         data: building,
        //       });
        //     },
        //     { concurrency: 3 }
        //   ),
        //   await pMap(deleteBuilding, async (building) => {
        //     await deleteSurveyBuilding({ buildingId: building.$id });
        //   }),
        // ]);

        // console.timeEnd("3 section");
        // setCurrentStep("4/9: จัดข้อมูลตู้ไฟฟ้าที่จะติดตั้งระบบ Zero export...");
        // //6.1 zeroExportCabinet
        // console.time("6.1 section");

        // const oldZeroCabinet = openDialog.data?.cabinet?.filter((d) => {
        //   return d.type === "zeroExport";
        // });
        // const deleteZeroCabinet = _.differenceWith(
        //   oldZeroCabinet,
        //   data.zeroExportCabinet,
        //   (a, b) => a.$id === b.docId
        // );
        // // console.log("deleteZeroCabinet", deleteZeroCabinet);
        // const addZeroCabinet = data.zeroExportCabinet.filter(
        //   (d) => d.docId === undefined
        // );
        // const updateZeroCabinet = _.differenceWith(
        //   data.zeroExportCabinet.filter((t) => !!t.docId),
        //   deleteZeroCabinet,
        //   (a, b) => String(a.docId).trim() === String(b.$id).trim()
        // );

        // const formatCreateZeroCabinet = await formatCabinet({
        //   zeroExportCabinet: addZeroCabinet,
        //   solarCellCabinet: [],
        // });

        // await Promise.all([
        //   await pMap(
        //     updateZeroCabinet,
        //     async (zeroCabinet) => {
        //       const formatUpdateCabinet = {
        //         cabinet: zeroCabinet.name,
        //         image: zeroCabinet.imageId ? [zeroCabinet.imageId] : [],
        //         type: "zeroExport",
        //       };

        //       if (zeroCabinet.photos) {
        //         const uploaded = await storage.createFile(
        //           process.env.NEXT_PUBLIC_BUCKET_SOLAR!,
        //           ID.unique(),
        //           zeroCabinet.photos as File
        //         );
        //         if (zeroCabinet.imageId) {
        //           await deleteImageSolar(zeroCabinet.imageId);
        //         }

        //         formatUpdateCabinet.image = [uploaded.$id];
        //       }

        //       await updateSurveyCabinet({
        //         data: formatUpdateCabinet,
        //         cabinetId: zeroCabinet.docId!,
        //       });
        //     },
        //     { concurrency: 3 }
        //   ),
        //   await pMap(
        //     formatCreateZeroCabinet,
        //     async (zeroCabinet) => {
        //       await createSurveyCabinet({
        //         surveyId: openDialog.data?.$id!,
        //         data: zeroCabinet,
        //       });
        //     },
        //     { concurrency: 3 }
        //   ),
        //   await pMap(deleteZeroCabinet, async (zeroCabinet) => {
        //     if (zeroCabinet.image) {
        //       await deleteImageSolar(zeroCabinet.image[0]);
        //     }
        //     await deleteSurveyCabinet({ cabinetId: zeroCabinet.$id });
        //   }),
        // ]);

        // console.timeEnd("6.1 section");
        // setCurrentStep("5/9: จัดข้อมูลตู้ไฟฟ้าที่จะติดตั้งระบบโซล่าเซลล์...");

        // console.time("6.2 section");
        // //6.2 solarCellCabinet

        // const oldSolarCabinet = openDialog.data?.cabinet?.filter((d) => {
        //   return d.type === "solarCell";
        // });
        // const deleteSolarCabinet = _.differenceWith(
        //   oldSolarCabinet,
        //   data.solarCellCabinet,
        //   (a, b) => a.$id === b.docId
        // );
        // // console.log("deleteZeroCabinet", deleteZeroCabinet);
        // const addSolarCabinet = data.solarCellCabinet.filter(
        //   (d) => d.docId === undefined
        // );
        // const updateSolarCabinet = _.differenceWith(
        //   data.solarCellCabinet.filter((t) => !!t.docId),
        //   deleteSolarCabinet,
        //   (a, b) => String(a.docId).trim() === String(b.$id).trim()
        // );

        // const formatCreateSolarCabinet = await formatCabinet({
        //   solarCellCabinet: addSolarCabinet,
        //   zeroExportCabinet: [],
        // });

        // await Promise.all([
        //   await pMap(
        //     updateSolarCabinet,
        //     async (solarCabinet) => {
        //       const formatUpdateCabinet = {
        //         cabinet: solarCabinet.name,
        //         image: solarCabinet.imageId ? [solarCabinet.imageId] : [],
        //         type: "solarCell",
        //       };

        //       if (solarCabinet.photos) {
        //         const uploaded = await storage.createFile(
        //           process.env.NEXT_PUBLIC_BUCKET_SOLAR!,
        //           ID.unique(),
        //           solarCabinet.photos as File
        //         );

        //         if (solarCabinet.imageId) {
        //           await deleteImageSolar(solarCabinet.imageId);
        //         }
        //         formatUpdateCabinet.image = [uploaded.$id];
        //       }
        //       await updateSurveyCabinet({
        //         data: formatUpdateCabinet,
        //         cabinetId: solarCabinet.docId!,
        //       });
        //     },
        //     { concurrency: 3 }
        //   ),
        //   await pMap(
        //     formatCreateSolarCabinet,
        //     async (solarCabinet) => {
        //       await createSurveyCabinet({
        //         surveyId: openDialog.data?.$id!,
        //         data: solarCabinet,
        //       });
        //     },
        //     { concurrency: 3 }
        //   ),
        //   await pMap(deleteSolarCabinet, async (solarCabinet) => {
        //     if (solarCabinet.image) {
        //       await deleteImageSolar(solarCabinet.image[0]);
        //     }
        //     await deleteSurveyCabinet({ cabinetId: solarCabinet.$id });
        //   }),
        // ]);

        // console.timeEnd("6.2 section");
        // setCurrentStep("6/9: จัดข้อมูลอาคารที่จะติดตั้งเเผงโซล่าเซลล์...");

        // console.time("6.3 section");
        // //6.3 solarCellBuiling

        // const deleteSolarBuilding = _.differenceWith(
        //   openDialog.data?.install_solar,
        //   data.solarCellBuiling,
        //   (a, b) => a.$id === b.docId
        // );
        // // console.log("deleteSolarBuilding", deleteSolarBuilding);
        // const addSolarBuilding = data.solarCellBuiling.filter(
        //   (d) => d.docId === undefined
        // );
        // // console.log("addSolarBuilding", addSolarBuilding);
        // const updateSolarBuilding = _.differenceWith(
        //   data.solarCellBuiling.filter((t) => !!t.docId),
        //   deleteSolarBuilding,
        //   (a, b) => String(a.docId).trim() === String(b.$id).trim()
        // );

        // await Promise.all([
        //   await pMap(
        //     updateSolarBuilding,
        //     async (solarBuilding) => {
        //       const formatUpdateSolarCellBulding = {
        //         name: solarBuilding.name,
        //         image: solarBuilding.imageId ? solarBuilding.imageId : [],
        //       };
        //       // console.log("solarBuilding", solarBuilding);
        //       const usedIds = new Set(
        //         solarBuilding.image?.map(extractFileId).filter(Boolean) // fileId ที่ถูกใช้งานอยู่
        //       );
        //       const toDelete = solarBuilding.imageId?.filter(
        //         (id) => !usedIds.has(String(id).trim())
        //       );
        //       // console.log("toDelete", toDelete);
        //       if (toDelete) {
        //         await pMap(toDelete, async (id) => {
        //           // console.log('id', id)
        //           await deleteImageSolar(id);
        //         });
        //       }
        //       if (solarBuilding.photos && solarBuilding.photos.length > 0) {
        //         const uploadIds = await pMap(
        //           solarBuilding.photos,
        //           async (item) => {
        //             const uploaded = await storage.createFile(
        //               process.env.NEXT_PUBLIC_BUCKET_SOLAR!,
        //               ID.unique(),
        //               item
        //             );
        //             return uploaded.$id;
        //           },
        //           { concurrency: 3 }
        //         );
        //         formatUpdateSolarCellBulding.image = [...usedIds, ...uploadIds];
        //       } else {
        //         formatUpdateSolarCellBulding.image = [...usedIds];
        //       }
        //       await updateSurveySolarInstall({
        //         data: formatUpdateSolarCellBulding,
        //         solarId: solarBuilding.docId!,
        //       });
        //     },
        //     { concurrency: 3 }
        //   ),
        //   await pMap(
        //     addSolarBuilding,
        //     async (solarBuildingg) => {
        //       const formatSolarBuilding = await formatSolarCellInstall({
        //         solarCellBuiling: [solarBuildingg],
        //       });
        //       await createSurveySolarInstall({
        //         surveyId: openDialog.data?.$id!,
        //         data: formatSolarBuilding[0],
        //       });
        //     },
        //     { concurrency: 3 }
        //   ),
        //   await pMap(deleteSolarBuilding, async (solarBuilding) => {
        //     if (solarBuilding.image) {
        //       await pMap(solarBuilding.image, async (id) => {
        //         await deleteImageSolar(id);
        //       });
        //     }
        //     await deleteSurveySolarInstall({ solarId: solarBuilding.$id });
        //   }),
        // ]);
        // console.timeEnd("6.3 section");
        // setCurrentStep("7/9: จัดข้อมูลภาพมุมสูง...");

        // //6.4 TopViewImage
        // console.time("6.4 section");

        // const usedTopView = new Set(
        //   data.topviewImage
        //     ?.map((image) => {
        //       if (typeof image === "string") {
        //         return extractFileId(image);
        //       }
        //     })
        //     .filter(Boolean) // fileId ที่ถูกใช้งานอยู่
        // );

        // const toDeleteTopView = openDialog.data?.topview_image?.filter((id) => {
        //   return !usedTopView.has(id as string);
        // });
        // const deleteTopViewId = toDeleteTopView?.map((d) =>
        //   extractFileId(d as string)
        // );
        // const toAddTopView = data.topviewImage?.filter(
        //   (image) => image instanceof File
        // );

        // const newTopViewId = await pMap(toAddTopView || [], async (item) => {
        //   const uploaded = await storage.createFile(
        //     process.env.NEXT_PUBLIC_BUCKET_SOLAR!,
        //     ID.unique(),
        //     item
        //   );
        //   return uploaded.$id;
        // });
        // await pMap(deleteTopViewId || [], async (id) => {
        //   await deleteImageSolar(id);
        // });

        // const arrTopViewId = [...Array.from(usedTopView), ...newTopViewId];

        // console.timeEnd("6.4 section");
        // //6.5 bottomViewImage
        // setCurrentStep("8/9: จัดข้อมูลภาพมุมต่ำ...");

        // console.time("6.5 section");

        // const usedBottomView = new Set(
        //   data.bottomViewImage
        //     ?.map((image) => {
        //       if (typeof image === "string") {
        //         return extractFileId(image);
        //       }
        //     })
        //     .filter(Boolean) // fileId ที่ถูกใช้งานอยู่
        // );

        // const toDeleteBottomView = openDialog.data?.bottomview_image?.filter(
        //   (id) => {
        //     return !usedBottomView.has(id as string);
        //   }
        // );
        // const deleteBottomViewId = toDeleteBottomView?.map((d) =>
        //   extractFileId(d as string)
        // );
        // const toAddBottomView = data.bottomViewImage?.filter(
        //   (image) => image instanceof File
        // );

        // const newBottomViewId = await pMap(
        //   toAddBottomView || [],
        //   async (item) => {
        //     const uploaded = await storage.createFile(
        //       process.env.NEXT_PUBLIC_BUCKET_SOLAR!,
        //       ID.unique(),
        //       item
        //     );
        //     return uploaded.$id;
        //   }
        // );
        // await pMap(deleteBottomViewId || [], async (id) => {
        //   await deleteImageSolar(id);
        // });

        // const arrBottomViewId = [
        //   ...Array.from(usedBottomView),
        //   ...newBottomViewId,
        // ];

        // console.timeEnd("6.5 section");
        // setCurrentStep("4/9: จัดข้อมูลการสำรวจ...");
        // const formatData = {
        //   school_name: data.schoolName,
        //   location: data.address,
        //   gps: data.gps,
        //   kwp: data.kwp,
        //   contact_name: data.contactName,
        //   contact_phone: data.contactPhone,
        //   surveyor: data.surveyor,
        //   grid_provider: data.gridProvider,
        //   roofplan: data.docsReceived?.roofplan || false,
        //   buildingplan: data.docsReceived?.buildingplan || false,
        //   elecplan: data.docsReceived?.elecplan || false,
        //   monthlybill: data.docsReceived?.monthlybill || false,
        //   loadprofile: data.docsReceived?.loadprofile || false,
        //   remark: data.remark,
        //   voltageLevel: data.voltageLevel,
        //   transformerCount: data.transformerCount,
        //   topview_image: arrTopViewId,
        //   bottomview_image: arrBottomViewId,
        // };
        // await updateSurvey({
        //   data: formatData as Partial<survey>,
        //   docId: openDialog.data.$id,
        // });
        Swal.fire({
          icon: "success",
          title: "บันทึกข้อมูลสำเร็จ",
        });
        surveyQuery.refetch();
        setOpenDialog({ open: false });
        reset();
      } catch (err: any) {
      } finally {
        setIsSubmitting(false);
        setCurrentStep("");
      }
    } else if (openDialog.data === undefined) {
      if (data.schoolName === "" || data.schoolName === undefined) {
        alert("กรุณากรอกข้อมูลชื่อโรงเรียน");
        return;
      }
      setIsSubmitting(true);
      try {
        setCurrentStep("1/8: จัดรูปข้อมูลหม้อแปลง...");
        const transformer = formatTransformer(data.transformer);

        setCurrentStep("2/8: จัดรูปข้อมูลตู้ไฟ...");
        const cabinets = await formatCabinet({
          solarCellCabinet: data.solarCellCabinet,
          zeroExportCabinet: data.zeroExportCabinet,
        });
        setCurrentStep("3/8: จัดข้อมูลพฤติกรรมผู้ใช้...");
        const userBehavior = formatUserBehavior(data.userBehavior);
        setCurrentStep("4/8: จัดข้อมูลอาคาร...");
        const building = formatBuilding(data.building);
        setCurrentStep("5/8: อัพโหลดข้อมูลติดตั้งโซลาร์...");
        const solarCellBuiling = await formatSolarCellInstall({
          solarCellBuiling: data.solarCellBuiling,
        });
        setCurrentStep("6/8: อัพโหลดภาพ Topview...");
        const topviewImage = await formatTopviewImage(
          data.topviewImage as File[]
        );
        setCurrentStep("7/8: อัพโหลดภาพ Bottomview...");
        const bottomViewImage = await formatBottomViewImage(
          data.bottomViewImage as File[]
        );
        setCurrentStep("8/8: บันทึกข้อมูลไปยังเซิร์ฟเวอร์...");
        const formatData = {
          school_name: data.schoolName,
          location: data.address,
          gps: data.gps,
          kwp: data.kwp,
          contact_name: data.contactName,
          contact_phone: data.contactPhone,
          surveyor: data.surveyor,
          grid_provider: data.gridProvider,
          roofplan: data.docsReceived?.roofplan || false,
          buildingplan: data.docsReceived?.buildingplan || false,
          elecplan: data.docsReceived?.elecplan || false,
          monthlybill: data.docsReceived?.monthlybill || false,
          loadprofile: data.docsReceived?.loadprofile || false,
          remark: data.remark,
          voltageLevel: data.voltageLevel,
          transformerCount: data.transformerCount,
          topview_image: topviewImage,
          bottomview_image: bottomViewImage,
        };
        await createSurvey({
          data: formatData,
          transformer: transformer,
          cabinet: cabinets as Partial<surveyCabinet>[],
          install_solar:
            solarCellBuiling as unknown as Partial<surveySolarInstall>[],
          rooftop_image: topviewImage,
          bottom_view_image: bottomViewImage,
          userBehavior:
            userBehavior as unknown as Partial<surveyUserBehavior>[],
          building: building,
        });
        alert("บันทึกข้อมูลสำเร็จ");
        surveyQuery.refetch();
        setOpenDialog({ open: false });
        reset();
      } catch (err: any) {
        console.error(err);
        alert("เกิดข้อผิดพลาด: " + currentStep + err.message);
      } finally {
        setIsSubmitting(false);
        setCurrentStep("");
      }
    }
  };

  const handleChangeSchool = (data: SchoolProps[] | undefined) => {
    setValue("schoolName", data?.[0]["school_name"]!);
    let address = `${data?.[0]["school_address"] || ""} ${
      data?.[0]["subdistrict"] || ""
    } ${data?.[0]["district"] || ""} ${data?.[0]["province"] || ""}  ${
      data?.[0]["post_code"] || ""
    }`;
    setValue("address", address);
    setValue("gps", data?.[0]["latitude"]! + "," + data?.[0]["longitude"]!);
  };

  const onEditBuilding = (props: {
    data: StructureFormValues;
    index: number;
  }) => {
    setIsOpen({
      data: props.data,
      index: props.index,
      open: true,
    });
  };

  const onDeleteBuilding = (index: number) => {
    const building = _.cloneDeep(watch("building") || []);
    building.splice(index, 1);
    setValue("building", building);
  };
  const watchBuiling = watch("building");
  return (
    <div className="py-2 ">
      <div className="flex justify-between  w-full px-8">
        <div>
          <p className="text-xl font-bold">
            รายงานการสำรวจ และตรวจสอบเบื้องต้น
          </p>
        </div>
        <Button
          onClick={() => setOpenDialog({ open: true })}
          variant="contained"
          color="primary"
        >
          <Add />
          <p>เพิ่มรายงาน</p>
        </Button>
      </div>
      <Backdrop open={isSubmitting} sx={{ color: "#fff", zIndex: 2000 }}>
        <Box textAlign="center">
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>{currentStep}</Typography>
        </Box>
      </Backdrop>
      <StructureModal
        isOpen={isOpen.open}
        onClose={() => {
          setIsOpen({ open: false });
        }}
        buildingData={isOpen.data}
        onSubmit={(data: StructureFormValues) => {
          if (isOpen.index !== undefined) {
            const building = watch("building") || [];
            building[isOpen.index] = data;
            setValue("building", building);
          } else {
            const building = watch("building") || [];
            building.push(data);
            setValue("building", building);
          }
        }}
      />
      <HeaderRow />
      <div>
        {surveyQuery.data?.documents.map((item) => (
          <div
            className="hover:bg-gray-100 items-center grid grid-cols-3 px-4 text-center py-2"
            key={item.$id}
          >
            <p>{item.school_name}</p>
            <p>{dayjs(item.$createdAt).format("DD/MM/YYYY HH:mm")}</p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => {
                  setOpenDialog({
                    open: true,
                    data: item as unknown as Models.Document & survey,
                  });
                }}
              >
                <Edit2 />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog
        open={openDialog.open}
        onClose={() => setOpenDialog({ open: false })}
        fullWidth={true}
        maxWidth="lg"
        sx={{
          "& .MuiDialog-paper": {
            // margin: "2rem",
            // padding: "2rem",
            maxWidth: "100%",
            width: "100%",
          },
        }}
      >
        <DialogTitle>
          <div className="flex items-center justify-between">
            <p>รายงานการสำรวจ และตรวจสอบเบื้องต้น</p>
            <Button onClick={() => setOpenDialog({ open: false })}>
              <Close />
            </Button>
          </div>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 0: รายงานการสำรวจและตรวจสอบเบื้องต้น */}

            <div className={` ${clsx(sectionClasses)}`}>
              <div className="flex items-center mb-4 sm:mb-6">
                <Details className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mr-2 sm:mr-3" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  รายงานการสำรวจ และตรวจสอบเบื้องต้น
                </h2>
              </div>

              <div className="mt-6 sm:mt-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                  ข้อมูลผู้ประสานงานโรงเรียน
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <label className={labelClasses}>
                      ชื่อโรงเรียน (School Name)
                    </label>
                    <Controller
                      name="schoolName"
                      control={control}
                      render={({ field }) => (
                        <SchoolAutoComplete
                          value={field.value}
                          readOnly={openDialog.data !== undefined}
                          masterDataKey={masterStore.masterDataKey}
                          handleChangeSchool={handleChangeSchool}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      สถานที่ตั้ง (School Location)
                    </label>
                    <input
                      type="text"
                      className={inputClasses}
                      placeholder="สถานที่ตั้ง"
                      {...register("address")}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      พิกัด (GPS Coordinates)
                    </label>
                    <input
                      type="tel"
                      className={inputClasses}
                      placeholder="พิกัด (GPS Coordinates)"
                      {...register("gps")}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      กำลังการผลิตติดตั้ง (kWp.)
                    </label>
                    <input
                      type="tel"
                      className={inputClasses}
                      placeholder="กำลังการผลิตติดตั้ง (kWp.)"
                      {...register("kwp", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      ผู้ติดต่อ (Coordinator)
                    </label>
                    <input
                      // type="t"
                      className={inputClasses}
                      placeholder="ผู้ติดต่อ (Coordinator)"
                      {...register("contactName")}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>เบอร์โทรผู้ติดต่อ</label>
                    <input
                      type="tel"
                      className={inputClasses}
                      placeholder="เบอร์โทรผู้ติดต่อ"
                      {...register("contactPhone")}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      ผู้สำรวจ/ผู้บันทึกการสำรวจ (Surveyor)
                    </label>
                    <input
                      // type="tel"
                      className={inputClasses}
                      placeholder="ผู้สำรวจ/ผู้บันทึกการสำรวจ (Surveyor)"
                      {...register("surveyor")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={sectionClasses}>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                1. พฤติกรรมของผู้ใช้ไฟฟ้า
              </h3>
              {userBehaviorArrForm.fields.map((field, index) => {
                const i = index + 1;
                return (
                  <div key={field.id} className="">
                    <div className="my-2">
                      <label
                        className={clsx(`!my-2 !bg-red-500` + labelClasses)}
                      >
                        มิเตอร์ที่ {index + 1}
                      </label>
                    </div>
                    <div className="grid sm:flex grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-4 items-center">
                      <select
                        className={inputClasses}
                        {...register(`userBehavior.${index}.meter`)}
                      >
                        <option value="">เลือก Meter</option>
                        {["TOD", "TOU"].map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        className={inputClasses}
                        placeholder="อาคาร"
                        {...register(`userBehavior.${index}.building`)}
                      />
                      <div className="flex w-full gap-2 items-center">
                        <input
                          type="text"
                          className={inputClasses}
                          placeholder="ค่าไฟฟ้าเฉลี่ย/เดือน"
                          {...register(`userBehavior.${index}.amount`)}
                        />
                        <p className="whitespace-nowrap">บาท/เดือน</p>
                      </div>
                      <div className="pb-1 flex gap-2 items-end">
                        {index !== 0 ? (
                          <Button
                            onClick={() => userBehaviorArrForm.remove(index)}
                            color="error"
                            className="h-fit  "
                            variant="contained"
                          >
                            {" "}
                            <X className="" />{" "}
                          </Button>
                        ) : (
                          <div className="w-16"></div>
                        )}
                        <Button
                          onClick={() =>
                            userBehaviorArrForm.append({
                              meter: "",
                              amount: "",
                              building: "",
                            })
                          }
                          className="h-fit "
                          variant="contained"
                        >
                          {" "}
                          <X className="rotate-45" />{" "}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Section 2 */}
            <div className={sectionClasses}>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                2. ลักษณะของผู้ใช้ไฟฟ้า
              </h3>
              <div className="grid grid-cols-1  gap-4">
                {/* <label className={labelClasses}>ผู้ให้บริการระบบไฟฟ้า</label> */}
                <Controller
                  name="gridProvider"
                  control={control}
                  render={({ field }) => {
                    return (
                      <FormControl
                        sx={{
                          flexDirection: "column",
                          // alignItems: "center",
                          // justifyContent: "",
                          gap: 2,
                        }}
                      >
                        <label className={labelClasses} id="gridProvider-label">
                          ผู้ให้บริการระบบไฟฟ้า
                        </label>
                        <RadioGroup
                          // className="flex-1 flex justify-center"
                          row
                          aria-labelledby="gridProvider-label"
                          value={field.value}
                          onChange={(_, value) => field.onChange(value)}
                        >
                          <FormControlLabel
                            value="MEA"
                            control={<Radio />}
                            label="MEA: การไฟฟ้านครหลวง"
                          />
                          <FormControlLabel
                            value="PEA"
                            control={<Radio />}
                            label="PEA: การไฟฟ้าส่วนภูมิภาค"
                          />
                        </RadioGroup>
                      </FormControl>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
                <div>
                  <FormControl component="fieldset" sx={{ mb: 2 }}>
                    <label className="text-base my-2">
                      ระดับแรงดันไฟฟ้าของลูกค้า (Connected Voltage Level)
                    </label>
                    <FormGroup row>
                      <Controller
                        name="voltageLevel"
                        control={control}
                        defaultValue={[]}
                        render={({ field: { value, onChange, name, ref } }) =>
                          // @ts-ignore
                          voltageoptions.map((opt) => (
                            <FormControlLabel
                              key={opt.value}
                              label={opt.label}
                              control={
                                <Checkbox
                                  // 1) Always pass a boolean to `checked`
                                  checked={value.includes(
                                    opt.value as unknown as boolean
                                  )}
                                  // 2) Wire onChange to MUI’s two-arg signature, then update the array
                                  onChange={(
                                    _event: React.ChangeEvent<HTMLInputElement>,
                                    checked: boolean
                                  ) => {
                                    const next = checked
                                      ? [...value, opt.value]
                                      : value.filter(
                                          (v) => v !== (opt.value as any)
                                        );
                                    onChange(next);
                                  }}
                                  // 3) Pass name & ref so RHF can track this input
                                  name={name}
                                  inputRef={ref}
                                />
                              }
                            />
                          ))
                        }
                      />
                    </FormGroup>
                  </FormControl>
                </div>
                <div>
                  <label className={labelClasses}>จำนวนหม้อแปลง</label>
                  <input
                    type="number"
                    className={inputClasses}
                    {...register("transformerCount", { valueAsNumber: true })}
                  />
                </div>
                {transformerArrForm.fields.map((field, index) => {
                  const i = index + 1;
                  return (
                    <div key={field.id} className="">
                      <div className="gap-2 flex w-full  ">
                        <div className=" gap-2 flex-1">
                          <label
                            className={clsx(
                              ` whitespace-nowrap ` + labelClasses
                            )}
                          >
                            พิกัดหม้อแปลงที่ {index + 1}
                          </label>
                          <input
                            type="text"
                            className={inputClasses}
                            placeholder="พิกัดหม้อแปลง"
                            {...register(`transformer.${index}.location`)}
                          />
                        </div>
                        <div className=" gap-2 flex-1">
                          <label
                            className={clsx(
                              ` whitespace-nowrap ` + labelClasses
                            )}
                          >
                            kva/มิเตอร์ {index + 1}
                          </label>
                          <input
                            type="text"
                            className={inputClasses}
                            placeholder="kva/มิเตอร์"
                            {...register(`transformer.${index}.meter`)}
                          />
                        </div>
                        <div className="grid sm:flex grid-cols-1  gap-4 items-end">
                          <div className="pb-1 flex gap-2 items-end">
                            {index !== 0 ? (
                              <Button
                                onClick={() => transformerArrForm.remove(index)}
                                color="error"
                                className="h-fit  "
                                variant="contained"
                              >
                                {" "}
                                <X className="" />{" "}
                              </Button>
                            ) : (
                              <div className="w-16"></div>
                            )}
                            <Button
                              onClick={() =>
                                transformerArrForm.append({
                                  meter: "",
                                  location: "",
                                })
                              }
                              className="h-fit "
                              variant="contained"
                            >
                              {" "}
                              <X className="rotate-45" />{" "}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 3 */}

            <div className={sectionClasses}>
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                  3. ข้อมูลโครงสร้าง
                </h3>
                <Button
                  variant="contained"
                  onClick={() =>
                    setIsOpen({
                      open: true,
                    })
                  }
                >
                  เพิ่มอาคาร
                </Button>
              </div>
              <div>
                {(watch("building") || []).map((building, index) => (
                  <div
                    className="grid grid-cols-1 sm:flex  gap-6 items-center mt-2"
                    key={index}
                  >
                    <div className="flex-1   flex gap-4 sm:gap-12 ">
                      <p>อาคารที่ {index + 1}</p>
                      <p className="">ชื่ออาคาร : {building.buildingName}</p>
                    </div>
                    <div className="flex gap-2 w-full  sm:w-fit">
                      <Button
                        className="w-full"
                        color="error"
                        variant="contained"
                        onClick={() => onDeleteBuilding(index)}
                      >
                        <label className="flex items-center gap-2">
                          <Delete className="" />
                          ลบ
                        </label>
                      </Button>
                      <Button
                        className="w-full"
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          onEditBuilding({ data: building, index })
                        }
                      >
                        <label className="flex items-center gap-2">
                          <Edit className="" />
                          แก้ไข
                        </label>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4 */}
            <div className={sectionClasses}>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                4. ข้อมูลเพิ่มเติมที่ได้รับ
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "แบบโครงสร้างหลังคา", value: "roofplan" },
                  { label: "แบบอาคาร", value: "buildingplan" },
                  { label: "แบบไฟฟ้า", value: "elecplan" },
                  { label: "ใบแจ้งหนี้ค่าไฟฟ้ารายเดือน", value: "monthlybill" },
                  { label: "Load Profile / AMR", value: "loadprofile" },
                ].map((doc) => (
                  <label key={doc.value} className="flex items-center">
                    <Controller
                      name={`docsReceived.${doc.value}` as any}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          {...field}
                          checked={field.value || false}
                        />
                      )}
                    />
                    <span className="ml-2">{doc.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section 5 */}
            <div className={sectionClasses}>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                5. บันทึก
              </h3>
              <textarea
                className={`${inputClasses} h-32`}
                {...register("remark")}
              />
            </div>

            {/* Section 6 */}
            <div className={sectionClasses}>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                6. รูปถ่าย (Pictures)
              </h3>
              <div className="space-y-4">
                <label className={labelClasses}>
                  6.1 ตู้ไฟฟ้าที่จะติดตั้งระบบ Zero export
                </label>
                {zeroExportCabinetArrForm?.fields.map((field, idx) => {
                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-4 items-center"
                    >
                      <input
                        placeholder="ตู้ ไฟฟ้า อาคาร"
                        {...register(`zeroExportCabinet.${idx}.name` as const)}
                        className="block w-full h-fit border px-2 py-1"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file)
                            setValue(
                              `zeroExportCabinet.${idx}.photos` as const,
                              file,
                              { shouldDirty: true, shouldValidate: true }
                            );
                        }}
                      />
                      {
                        <>
                          {zeroPreviews[idx] !== "" &&
                          zeroPreviews[idx] !== undefined ? (
                            <img
                              src={zeroPreviews[idx]}
                              className="w-24 h-24 object-cover rounded"
                            />
                          ) : field.image ? (
                            <img
                              src={field.image}
                              className="w-24 h-24 object-cover rounded"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gray-200 rounded"></div>
                          )}
                        </>
                      }
                      <div className="pb-1 flex gap-2 items-end">
                        {idx !== 0 ? (
                          <Button
                            onClick={() => zeroExportCabinetArrForm.remove(idx)}
                            color="error"
                            className="h-fit  "
                            variant="contained"
                          >
                            {" "}
                            <X className="" />{" "}
                          </Button>
                        ) : (
                          <div className="w-16"></div>
                        )}
                        <Button
                          onClick={() =>
                            zeroExportCabinetArrForm.append({
                              name: "",
                              photos: undefined,
                            })
                          }
                          className="h-fit "
                          variant="contained"
                        >
                          {" "}
                          <X className="rotate-45" />{" "}
                        </Button>
                      </div>
                    </div>
                  );
                })}

                <div>
                  <label className={labelClasses}>
                    6.2 ตู้ไฟฟ้าที่จะเชื่อมต่อระบบโซล่าเซลล์
                  </label>
                  {solarCellCabinetArrForm?.fields.map((field, idx) => {
                    return (
                      <div
                        key={field.id}
                        className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center mb-4"
                      >
                        <input
                          placeholder="ตู้ ไฟฟ้า อาคาร"
                          {...register(`solarCellCabinet.${idx}.name` as const)}
                          className="block w-full h-fit border px-2 py-1"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file)
                              setValue(
                                `solarCellCabinet.${idx}.photos` as const,
                                file,
                                { shouldDirty: true, shouldValidate: true }
                              );
                          }}
                        />
                        {
                          <>
                            {solarPreviews[idx] !== "" &&
                            solarPreviews[idx] !== undefined ? (
                              <img
                                src={solarPreviews[idx]}
                                className="w-24 h-24 object-cover rounded"
                              />
                            ) : field.image ? (
                              <img
                                src={field.image}
                                className="w-24 h-24 object-cover rounded"
                              />
                            ) : (
                              <div className="w-24 h-24 bg-gray-200 rounded"></div>
                            )}
                          </>
                        }
                        <div className="pb-1 flex gap-2 items-end">
                          {idx !== 0 ? (
                            <Button
                              onClick={() =>
                                solarCellCabinetArrForm.remove(idx)
                              }
                              color="error"
                              className="h-fit  "
                              variant="contained"
                            >
                              {" "}
                              <X className="" />{" "}
                            </Button>
                          ) : (
                            <div className="w-16"></div>
                          )}
                          <Button
                            onClick={() =>
                              solarCellCabinetArrForm.append({
                                name: "",
                                photos: undefined,
                              })
                            }
                            className="h-fit "
                            variant="contained"
                          >
                            {" "}
                            <X className="rotate-45" />{" "}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <label className={labelClasses}>
                    6.3 อาคารที่จะติดตั้งเเผงโซล่าเซลล์
                  </label>
                  {solarCellBuilingtArrForm.fields.map((field, i) => (
                    <div
                      key={field.id}
                      className="border p-3 rounded space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          {...register(`solarCellBuiling.${i}.name` as const)}
                          placeholder="ตู้ ไฟฟ้า อาคาร"
                          className="w-full border px-2 py-1"
                        />
                        <div className="pb-1 flex gap-2 items-end">
                          {i !== 0 ? (
                            <Button
                              onClick={() => solarCellBuilingtArrForm.remove(i)}
                              color="error"
                              className="h-fit  "
                              variant="contained"
                            >
                              {" "}
                              <X className="" />{" "}
                            </Button>
                          ) : (
                            <div className="w-16"></div>
                          )}
                          <Button
                            onClick={() =>
                              solarCellBuilingtArrForm.append({
                                name: "",
                                photos: [],
                              })
                            }
                            className="h-fit "
                            variant="contained"
                          >
                            {" "}
                            <X className="rotate-45" />{" "}
                          </Button>
                        </div>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files
                            ? Array.from(e.target.files)
                            : [];
                          const old =
                            watch(`solarCellBuiling.${i}.photos`) || [];
                          setValue(
                            `solarCellBuiling.${i}.photos` as const,
                            [...old, ...files] as any,
                            { shouldDirty: true, shouldValidate: true }
                          );
                        }}
                      />

                      {/* 4) แสดง preview หลายภาพ */}
                      <div className="flex flex-wrap gap-2">
                        {solarCellBuilingPreviews[i]?.image?.map((d, j) => {
                          return (
                            <div key={d} className="relative w-24 h-24">
                              <img
                                src={d}
                                className="w-24 h-24 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const old =
                                    getValues(`solarCellBuiling.${i}.image`) ||
                                    [];
                                  const next = old.filter(
                                    (_, idx) => idx !== j
                                  );

                                  setValue(
                                    `solarCellBuiling.${i}.image` as const,
                                    next,
                                    { shouldDirty: true }
                                  );
                                }}
                                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}

                        {solarCellBuilingPreviews[i]?.photos?.map((src, j) => {
                          return (
                            <div key={j} className="relative w-24 h-24">
                              <img
                                src={src}
                                alt={`preview ${j}`}
                                className="object-cover w-full h-full rounded"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const old =
                                    getValues(`solarCellBuiling.${i}.photos`) ||
                                    [];
                                  const next = old.filter(
                                    (_, idx) => idx !== j
                                  );
                                  setValue(
                                    `solarCellBuiling.${i}.photos` as const,
                                    next,
                                    { shouldDirty: true }
                                  );
                                }}
                                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {/* 6.4 Top Images */}
                  <div className="space-y-2">
                    <h2 className="font-semibold">6.4 ภาพมุมสูง (โดยรวม)</h2>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files
                          ? Array.from(e.target.files)
                          : [];
                        const old = getValues("topviewImage");
                        setValue(
                          "topviewImage",
                          [...(old || []), ...files] as File[],
                          {
                            shouldDirty: true,
                            shouldValidate: true,
                          }
                        );
                      }}
                    />
                    <div className="flex flex-wrap gap-2">
                      {topPreviews.map((src, j) => (
                        <div key={j} className="relative w-24 h-24">
                          <img
                            src={src}
                            alt={`topviewImage ${j}`}
                            className="object-cover w-full h-full rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const old = getValues("topviewImage");
                              const next = old?.filter(
                                (_, idx) => idx !== j
                              ) as File[];
                              setValue("topviewImage", next, {
                                shouldDirty: true,
                              });
                            }}
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 6.5 Bottom‐view Images */}
                  <div className="space-y-2">
                    <h2 className="font-semibold">6.5 ภาพมุมต่ำ (โดยรวม)</h2>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files
                          ? Array.from(e.target.files)
                          : [];
                        const old = getValues("bottomViewImage");
                        setValue(
                          "bottomViewImage",
                          [...(old || []), ...files] as File[],
                          {
                            shouldDirty: true,
                            shouldValidate: true,
                          }
                        );
                      }}
                    />
                    <div className="flex flex-wrap gap-2">
                      {bottomPreviews.map((src, j) => (
                        <div key={j} className="relative w-24 h-24">
                          <img
                            src={src}
                            alt={`bottomview ${j}`}
                            className="object-cover w-full h-full rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const old = getValues("bottomViewImage");
                              const next = old?.filter((_, idx) => idx !== j);
                              setValue("bottomViewImage", next as File[], {
                                shouldDirty: true,
                              });
                            }}
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Box textAlign="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                {openDialog.data === undefined ? "บันทึกข้อมูล" : "แก้ไขข้อมูล"}
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const HeaderRow = () => {
  return (
    <div className="grid grid-cols-3 px-4 text-lg font-semibold text-center py-2">
      <p>ชื่อโรงเรียน</p>
      <p>วันที่บันทึก</p>
      <p>Action</p>
    </div>
  );
};
