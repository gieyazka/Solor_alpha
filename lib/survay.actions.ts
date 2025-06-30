"use server";
import {
  survey,
  SurveyBuilding,
  surveyCabinet,
  surveySolarInstall,
  surveyTransformer,
  surveyUserBehavior,
} from "@/@type";
import { createAdminClient } from "@/utils/appwrite";
import { ID } from "node-appwrite";
import pMap from "p-map";
const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_SURVEY_COLLECTION_ID: SURVEY_COLLECTION_ID,
  APPWRITE_SURVEY_SOLAR_INSTALL_COLLECTION_ID:
    SURVEY_SOLAR_INSTALL_COLLECTION_ID,
  APPWRITE_SURVEY_TRANSFORMER_COLLECTION_ID: SURVEY_TRANSFORMER_COLLECTION_ID,
  APPWRITE_SURVEY_CABINET_COLLECTION_ID: SURVEY_CABINET_COLLECTION_ID,
  APPWRITE_SURVEY_BUILDING_COLLECTION_ID: SURVEY_BUILDING_COLLECTION_ID,
  APPWRITE_SURVEY_USER_BEHAVIOR_COLLECTION_ID:
    SURVEY_USER_BEHAVIOR_COLLECTION_ID,
} = process.env;
export const createSurvey = async (props: {
  data: Partial<survey>;
  transformer?: Partial<surveyTransformer>[];
  cabinet?: Partial<surveyCabinet>[];
  userBehavior?: Partial<surveyUserBehavior>[];
  building?: Partial<SurveyBuilding>[];
  install_solar?: Partial<surveySolarInstall>[];
  rooftop_image?: string[];
  bottom_view_image?: string[];
}) => {
  try {
    const { data } = props;
    const appwrite = await createAdminClient();
    const survey = await appwrite.database.createDocument(
      DATABASE_ID!,
      SURVEY_COLLECTION_ID!,
      ID.unique(),
      data
    );
    const tasks: (() => Promise<any>)[] = [];

    // transformer
    props.transformer?.forEach((t) =>
      tasks.push(() =>
        createSurveyTransformer({ surveyId: survey.$id, data: t })
      )
    );
    // cabinet
    props.cabinet?.forEach((c) =>
      tasks.push(() => createSurveyCabinet({ surveyId: survey.$id, data: c }))
    );
    // userBehavior
    props.userBehavior?.forEach((u) =>
      tasks.push(() =>
        createSurveyUserBehavior({ surveyId: survey.$id, data: u })
      )
    );
    // install_solar
    props.install_solar?.forEach((i) =>
      tasks.push(() =>
        createSurveySolarInstall({ surveyId: survey.$id, data: i })
      )
    );
    // building
    props.building?.forEach((b) =>
      tasks.push(() => createSurveyBuilding({ surveyId: survey.$id, data: b }))
    );
    // รันงานทั้งหมดครั้งเดียว ควบคุม concurrency เป็น 5
    await pMap(tasks, (task) => task(), { concurrency: 5 });
    return JSON.parse(JSON.stringify(survey));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createSurveyTransformer = async (props: {
  surveyId: string;
  data: Partial<surveyTransformer>;
}) => {
  try {
    const { data, surveyId } = props;
    const appwrite = await createAdminClient();
    const survey = await appwrite.database.createDocument(
      DATABASE_ID!,
      SURVEY_TRANSFORMER_COLLECTION_ID!,
      ID.unique(),
      { ...data, survey: surveyId }
    );
    return JSON.parse(JSON.stringify(survey));
  } catch (error) {
    console.error(error);
  }
};

export const createSurveyCabinet = async (props: {
  surveyId: string;
  data: Partial<surveyCabinet>;
}) => {
  try {
    const { data, surveyId } = props;
    const appwrite = await createAdminClient();
    const survey = await appwrite.database.createDocument(
      DATABASE_ID!,
      SURVEY_CABINET_COLLECTION_ID!,
      ID.unique(),
      { ...data, survey: surveyId }
    );
    return JSON.parse(JSON.stringify(survey));
  } catch (error) {
    console.error(error);
  }
};

export const createSurveyUserBehavior = async (props: {
  surveyId: string;
  data: Partial<surveyUserBehavior>;
}) => {
  try {
    const { data, surveyId } = props;
    const appwrite = await createAdminClient();
    const survey = await appwrite.database.createDocument(
      DATABASE_ID!,
      SURVEY_USER_BEHAVIOR_COLLECTION_ID!,
      ID.unique(),
      { ...data, survey: surveyId }
    );
    return JSON.parse(JSON.stringify(survey));
  } catch (error) {
    console.error(error);
  }
};
export const createSurveyBuilding = async (props: {
  surveyId: string;
  data: Partial<SurveyBuilding>;
}) => {
  try {
    const { data, surveyId } = props;
    const appwrite = await createAdminClient();
    const survey = await appwrite.database.createDocument(
      DATABASE_ID!,
      SURVEY_BUILDING_COLLECTION_ID!,
      ID.unique(),
      { ...data, survey: surveyId }
    );
    return JSON.parse(JSON.stringify(survey));
  } catch (error) {
    console.error(error);
  }
};

export const createSurveySolarInstall = async (props: {
  surveyId: string;
  data: Partial<surveySolarInstall>;
}) => {
  try {
    const { data, surveyId } = props;
    const appwrite = await createAdminClient();
    const survey = await appwrite.database.createDocument(
      DATABASE_ID!,
      SURVEY_SOLAR_INSTALL_COLLECTION_ID!,
      ID.unique(),
      { ...data, survey: surveyId }
    );
    return JSON.parse(JSON.stringify(survey));
  } catch (error) {
    console.error(error);
  }
};
