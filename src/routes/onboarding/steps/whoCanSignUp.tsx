import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import StyledRadio from "../../../common/component/styled/Radio";
import StyledButton from "../../../common/component/styled/Button";
import { useGetLoginConfigQuery, useUpdateLoginConfigMutation } from "../../../app/services/server";
import { WhoCanSignUp } from "../../../types/server";
import { useTranslation } from "react-i18next";
import { useWizard } from "react-use-wizard";

const StyledWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > .primaryText {
    text-align: center;
    font-weight: 700;
    font-size: 24px;
    line-height: 30px;
    margin-bottom: 8px;
  }

  > .secondaryText {
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 24px;
  }

  > form {
    width: 512px;
  }

  > .button {
    width: 124px;
    height: 44px;
    margin-top: 24px;
  }
`;

export default function SignUpSetting() {
  const { t } = useTranslation("welcome");
  const { t: st } = useTranslation("setting");
  const { nextStep } = useWizard();
  const { data: loginConfig, refetch } = useGetLoginConfigQuery();
  const [updateLoginConfig, { isSuccess, error }] = useUpdateLoginConfigMutation();

  const [value, setValue] = useState<WhoCanSignUp>();
  useEffect(() => {
    refetch();
  }, []);

  // Sync to `value` when `loginConfig` is fetched
  useEffect(() => {
    if (loginConfig) {
      console.log("login config", loginConfig.who_can_sign_up);

      setValue(loginConfig.who_can_sign_up);
    }
  }, [loginConfig]);

  // Display error
  useEffect(() => {
    if (error === undefined) return;
    toast.error(`Failed to update sign up rule: ${error.data}`);
  }, [error]);

  // Increment `step` when updating has completed
  useEffect(() => {
    if (isSuccess) nextStep();
  }, [isSuccess]);

  return (
    <StyledWrapper>
      <span className="primaryText">{t("onboarding.invite_title")}</span>
      <span className="secondaryText">{t("onboarding.invite_desc")}</span>
      {value && <StyledRadio
        options={[st("overview.sign_up.everyone"), st("overview.sign_up.invite")]}
        values={["EveryOne", "InvitationOnly"]}
        value={value}
        onChange={setValue}
      />}
      <StyledButton
        className="button"
        disabled={!value}
        onClick={() => {
          // nextStep();
          if (loginConfig !== undefined) {
            if (loginConfig.who_can_sign_up !== value) {

              updateLoginConfig({
                ...loginConfig,
                who_can_sign_up: value
              });
            } else {
              nextStep();
            }
          }
        }}
      >
        {t("onboarding.confirm")}
      </StyledButton>
    </StyledWrapper>
  );
}
