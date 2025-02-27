import styled from "styled-components";
import StyledInput from "../../../common/component/styled/Input";
import StyledButton from "../../../common/component/styled/Button";
import useInviteLink from "../../../common/hook/useInviteLink";
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
    margin-bottom: 40px;
  }

  > .tip {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: #475467;
    margin-bottom: 8px;
  }

  > .link {
    position: relative;
    background: #ffffff;
    border: 1px solid #f4f4f5;
    box-shadow: 0 1px 2px rgba(31, 41, 55, 0.08);
    border-radius: 4px;
    width: 374px;
    display: flex;

    > input {
      border: none;
      box-shadow: none;
      padding: 11px 0 11px 8px;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #78787c;
    }

    > button {
      padding: 0 8px;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: #22ccee;
      transition: color 150ms ease-in-out;

      &:hover {
        color: #088ab2;
      }
    }
  }

  > .button {
    width: 124px;
    height: 44px;
    margin-top: 24px;
  }
`;
export default function InviteLink() {
  const { t } = useTranslation("welcome", { keyPrefix: "onboarding" });
  const { t: ct } = useTranslation();
  const { nextStep } = useWizard();
  const { link, linkCopied, copyLink } = useInviteLink();
  return (
    <StyledWrapper>
      <span className="primaryText">{t("invite_title")}</span>
      <span className="secondaryText">{t("last_tip")}</span>
      <span className="tip">{t("last_desc")}</span>
      <div className="link">
        <StyledInput className="large" readOnly placeholder="Generating" value={link} />
        <StyledButton onClick={copyLink} className="ghost small border_less">
          {linkCopied ? "Copied" : ct("action.copy")}
        </StyledButton>
      </div>
      <StyledButton className="button" onClick={nextStep}>
        {t("done")}
      </StyledButton>
    </StyledWrapper>
  );
}
