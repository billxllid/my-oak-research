"use client";

import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  SourceCreateSchema,
  SourceUpdateSchema,
  WebSourceCreateSchema,
  DarknetSourceCreateSchema,
  SearchEngineSourceCreateSchema,
  SocialMediaSourceCreateSchema,
} from "@/app/api/_utils/zod";
import { SettingEditDialog } from "@/components/layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { SelectItem } from "@/components/ui/select";
import { ErrorMessage } from "@/components/business";
import { Source, Proxy, SourceType } from "@/lib/generated/prisma";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import SelectProxy from "./SelectProxy";
import { useSourceMutation } from "@/hooks/useSourceMutation";
import { SocialMediaFields } from "./SocialMediaFields";
import { DarknetFields } from "./DarknetFields";
import { SearchEngineFields } from "./SearchEngineFields";
import { WebFields } from "./WebFields";
import { CrawlerEngineEnum } from "@/app/api/_utils/zod";
import { SearchEngineKindEnum } from "@/app/api/_utils/zod";

// Helper to get schema based on type
const getValidationSchema = (type: SourceType, isUpdate: boolean) => {
  if (isUpdate) return SourceUpdateSchema;

  switch (type) {
    case 'WEB':
      return WebSourceCreateSchema;
    case 'DARKNET':
      return DarknetSourceCreateSchema;
    case 'SEARCH_ENGINE':
      return SearchEngineSourceCreateSchema;
    case 'SOCIAL_MEDIA':
      return SocialMediaSourceCreateSchema;
    default:
      return SourceCreateSchema;
  }
};

// Helper to get default values
const getDefaultValues = (source?: Source, sourceType?: SourceType) => {
  const base = {
    name: source?.name || "",
    description: source?.description || "",
    type: source?.type || sourceType,
    active: source?.active ?? true,
    rateLimit: source?.rateLimit || 10,
    proxyId: source?.proxyId || null,
  };

  switch (base.type) {
    case 'WEB':
      return { ...base, web: source?.web || { url: '', crawlerEngine: 'FETCH', render: false, robotsRespect: true } };
    case 'DARKNET':
      return { ...base, darknet: source?.darknet || { url: '', proxyId: null } };
    case 'SOCIAL_MEDIA':
      // Make sure config is an object
      const socialConfig = source?.social?.config || {};
      return { ...base, social: source?.social || { platform: null, config: socialConfig, credentialId: null, proxyId: null } };
    case 'SEARCH_ENGINE':
      return { ...base, search: source?.search || { engine: null, query: '', region: null, lang: null, apiEndpoint: null, options: null, credentialId: null } };
    default:
      return base;
  }
};

const CommonFields = ({ register, errors }) => (
  <>
    <div className="grid gap-3">
      <Label htmlFor="name">Name</Label>
      <Input id="name" placeholder="Name" {...register("name")} />
      <ErrorMessage>{errors.name?.message}</ErrorMessage>
    </div>
    <div className="grid gap-3">
      <Label htmlFor="description">Description</Label>
      <Textarea id="description" placeholder="Description" rows={3} {...register("description")} />
      <ErrorMessage>{errors.description?.message}</ErrorMessage>
    </div>
  </>
);

const WebFields = ({ register, control, errors, proxies, watch }) => {
  const crawlerEngine = watch("web.crawlerEngine") as CrawlerEngineEnum | undefined;
  return (
    <>
      <div className="grid gap-3">
        <Label htmlFor="web.url">URL</Label>
        <Input id="web.url" placeholder="https://www.example.com" {...register("web.url")} />
        <ErrorMessage>{errors.web?.url?.message}</ErrorMessage>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="web.crawlerEngine">Crawler Engine</Label>
        <Controller
          name="web.crawlerEngine"
          control={control}
          render={({ field }) => (
            <ControlledSelect
              value={field.value as string}
              onValueChange={field.onChange}
              placeholder="Select a crawler engine"
            >
              {Object.values(CrawlerEngineEnum.enum).map((engine) => (
                <SelectItem key={engine} value={engine}>
                  {engine}
                </SelectItem>
              ))}
            </ControlledSelect>
          )}
        />
        <ErrorMessage>{errors.web?.crawlerEngine?.message}</ErrorMessage>
      </div>
      {crawlerEngine === "CUSTOM" && (
        <div className="grid gap-3">
          <Label htmlFor="web.crawlerConfig">Custom Crawler Config (JSON)</Label>
          <Textarea
            id="web.crawlerConfig"
            placeholder={'{ "key": "value" }'}
            rows={5}
            {...register("web.crawlerConfig")}
          />
          <ErrorMessage>{errors.web?.crawlerConfig?.message}</ErrorMessage>
        </div>
      )}
      <SelectProxy control={control} proxies={proxies} error={errors.proxyId?.message} />
      {/* Add other WEB fields: headers, parseRules, crawlerEngine, etc. */}
    </>
  );
};


const SourceDialog = ({ triggerButton, source: propSource, proxies, sourceType: propSourceType, onOpenChange, open }) => {
  const [currentSource, setCurrentSource] = useState(propSource);
  const [currentSourceType, setCurrentSourceType] = useState(propSourceType);

  useEffect(() => {
    if (open) {
      setCurrentSource(propSource);
      setCurrentSourceType(propSourceType);
    }
  }, [open, propSource, propSourceType]);

  const isUpdate = !!currentSource;

  const { control, register, handleSubmit, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(getValidationSchema(currentSourceType || (currentSource?.type || 'WEB'), isUpdate)),
    defaultValues: getDefaultValues(currentSource, currentSourceType),
  });

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(currentSource, currentSourceType));
    }
  }, [open, currentSource, currentSourceType, reset]);

  const mutation = useSourceMutation({
    sourceId: currentSource?.id,
    sourceType: currentSourceType || currentSource.type,
    onSuccess: () => {
      onOpenChange(false);
      if (!isUpdate) {
        reset();
      }
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <SettingEditDialog
      props={{ open, onOpenChange }}
      title={isUpdate ? "Edit Source" : "Add Source"}
      description={isUpdate ? "Edit this source." : `Add a new ${currentSourceType} source.`}
      triggerButton={triggerButton}
      buttonText={mutation.isPending ? (isUpdate ? "Updating..." : "Adding...") : (isUpdate ? "Update" : "Add")}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-4">
        <CommonFields register={register} errors={errors} />
        { (currentSourceType || currentSource.type) === 'WEB' && <WebFields register={register} control={control} errors={errors} proxies={proxies} watch={watch} /> }
        { (currentSourceType || currentSource.type) === 'DARKNET' && <DarknetFields register={register} control={control} errors={errors} proxies={proxies} watch={watch} /> }
        { (currentSourceType || currentSource.type) === 'SOCIAL_MEDIA' && <SocialMediaFields register={register} control={control} errors={errors} proxies={proxies} watch={watch} /> }
        { (currentSourceType || currentSource.type) === 'SEARCH_ENGINE' && <SearchEngineFields register={register} control={control} errors={errors} proxies={proxies} watch={watch} /> }
        {/* Add other source type fields here */}
      </div>
    </SettingEditDialog>
  );
};

export default SourceDialog;
