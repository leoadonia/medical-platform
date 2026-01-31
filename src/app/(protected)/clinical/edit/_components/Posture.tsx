import { FormGrid } from "@/app/_components/FormGrid";
import { useClinicalStore } from "@/lib/stores/clinical";
import { PostureLevelOptions } from "@/lib/types/clinical";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useState } from "react";
import { ClinicalCard } from "./ClinicalCard";

const PostureCenteredLabels = ["", "左偏", "右偏"];

const Head = () => {
  const { clinical, updateClinical } = useClinicalStore();
  const { posture } = clinical;

  return (
    <FormGrid id="head" label="头部是否居中">
      <RadioGroup
        row
        aria-labelledby="position-label"
        name="position"
        value={posture.head_centered}
        onChange={(e) => {
          const { value } = e.target;
          updateClinical({ posture: { ...posture, head_centered: value } });
        }}
      >
        {PostureCenteredLabels.map((label, index) => (
          <FormControlLabel
            key={index}
            value={label}
            control={<Radio color="info" />}
            label={label || "是"}
          />
        ))}
      </RadioGroup>
    </FormGrid>
  );
};

const AcromialLevel = () => {
  const { clinical, updateClinical } = useClinicalStore();
  const { posture } = clinical;

  return (
    <FormGrid id="acromial_level" label="肩峰端是否等高">
      <RadioGroup
        row
        aria-labelledby="acromial_level-label"
        name="acromial_level"
        value={posture.acromial_level}
        onChange={(e) => {
          const { value } = e.target;
          updateClinical({ posture: { ...posture, acromial_level: value } });
        }}
      >
        {PostureLevelOptions.map((label, index) => (
          <FormControlLabel
            key={index}
            value={label}
            control={<Radio color="info" />}
            label={label || "是"}
          />
        ))}
      </RadioGroup>
    </FormGrid>
  );
};

const ScapulaLevel = () => {
  const { clinical, updateClinical } = useClinicalStore();
  const { posture } = clinical;

  return (
    <FormGrid id="scapula_level" label="肩胛下角是否等高">
      <RadioGroup
        row
        aria-labelledby="scapula_level-label"
        name="scapula_level"
        value={posture.scapula_level}
        onChange={(e) => {
          const { value } = e.target;
          updateClinical({ posture: { ...posture, scapula_level: value } });
        }}
      >
        {PostureLevelOptions.map((label, index) => (
          <FormControlLabel
            key={index}
            value={label}
            control={<Radio color="info" />}
            label={label || "是"}
          />
        ))}
      </RadioGroup>
    </FormGrid>
  );
};

const PelvisLevel = () => {
  const { clinical, updateClinical } = useClinicalStore();
  const { posture } = clinical;

  return (
    <FormGrid id="pelvis_level" label="骨盆是否等高">
      <RadioGroup
        row
        aria-labelledby="pelvis_level-label"
        name="pelvis_level"
        value={posture.pelvis_level}
        onChange={(e) => {
          const { value } = e.target;
          updateClinical({ posture: { ...posture, pelvis_level: value } });
        }}
      >
        {PostureLevelOptions.map((label, index) => (
          <FormControlLabel
            key={index}
            value={label}
            control={<Radio color="info" />}
            label={label || "是"}
          />
        ))}
      </RadioGroup>
    </FormGrid>
  );
};

const Kyphosis = () => {
  const { clinical, updateClinical } = useClinicalStore();
  const { posture } = clinical;
  const [kyphosis, setKyphosis] = useState(posture.kyphosis ? "Y" : "N");

  return (
    <FormGrid id="kyphosis" label="是否驼背">
      <RadioGroup
        row
        aria-labelledby="kyphosis-label"
        name="kyphosis"
        value={kyphosis}
        onChange={(e) => {
          const { value } = e.target;
          setKyphosis(value);
          updateClinical({ posture: { ...posture, kyphosis: value === "Y" } });
        }}
      >
        <FormControlLabel
          key={0}
          value="Y"
          control={<Radio color="info" />}
          label="是"
        />
        <FormControlLabel
          key={1}
          value={"N"}
          control={<Radio color="info" />}
          label="否"
        />
      </RadioGroup>
    </FormGrid>
  );
};

const Flatback = () => {
  const { clinical, updateClinical } = useClinicalStore();
  const { posture } = clinical;
  const [flatback, setFlatback] = useState(posture.flatback ? "Y" : "N");

  return (
    <FormGrid id="flatback" label="是否平背">
      <RadioGroup
        row
        aria-labelledby="flatback-label"
        name="flatback"
        value={flatback}
        onChange={(e) => {
          const { value } = e.target;
          setFlatback(value);
          updateClinical({ posture: { ...posture, flatback: value === "Y" } });
        }}
      >
        <FormControlLabel
          key={0}
          value="Y"
          control={<Radio color="info" />}
          label="是"
        />
        <FormControlLabel
          key={1}
          value={"N"}
          control={<Radio color="info" />}
          label="否"
        />
      </RadioGroup>
    </FormGrid>
  );
};

export const Posture = () => {
  return (
    <ClinicalCard>
      <Head />
      <AcromialLevel />
      <ScapulaLevel />
      <PelvisLevel />
      <Kyphosis />
      <Flatback />
    </ClinicalCard>
  );
};
