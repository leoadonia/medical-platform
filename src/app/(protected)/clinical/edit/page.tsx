"use client";

import { createClinical, updateClinical } from "@/lib/apis/clinical";
import { useClinicalStore } from "@/lib/stores/clinical";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Balance } from "./_components/Balance";
import { Brace } from "./_components/Brace";
import { ClinicalCard } from "./_components/ClinicalCard";
import { Cobb } from "./_components/Cobb";
import { Exercise } from "./_components/Exercise";
import { FlexionAtr } from "./_components/FlexionAtr";
import { Mobility } from "./_components/Mobility";
import { PainRate } from "./_components/PainRate";
import { Posture } from "./_components/Posture";
import { Risser } from "./_components/Risser";
import { Tenderness } from "./_components/Tenderness";
import { Treatment } from "./_components/Treatment";
import { useNavbarStore } from "@/components/sidebar/store";

const ClinicalEditPage = () => {
  const { clinical } = useClinicalStore();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      if (clinical.id === 0) {
        await createClinical(clinical);
      } else {
        await updateClinical(clinical);
      }

      toast.success("添加成功.");

      const href = useNavbarStore.getState().back() || "/clinical";
      router.replace(href);
    } catch (err) {
      toast.error(err as string);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ClinicalCard>
        <Cobb />
        <FlexionAtr />
        <PainRate />
      </ClinicalCard>

      <Brace />

      <ClinicalCard>
        <Treatment />
        <Exercise />
      </ClinicalCard>

      <ClinicalCard>
        <Mobility />
        <Balance />
        <Tenderness />
      </ClinicalCard>

      <Posture />
      <Risser />

      <Button
        className="from-primary-200 to-info-400 mx-auto mt-8 flex min-w-3xs bg-linear-to-r text-white"
        onClick={handleSubmit}
      >
        确定
      </Button>
    </div>
  );
};

export default ClinicalEditPage;
