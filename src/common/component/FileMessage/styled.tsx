import styled from "styled-components";

const Styled = styled.div`
  background: #f3f4f6;
  border: 1px solid #d4d4d4;
  box-sizing: border-box;
  border-radius: 6px;
  width: 370px;
  height: 66px;
  &.sending {
    opacity: 0.9;
  }
  * {
    user-select: text;
  }
  .basic {
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    .icon {
      width: 36px;
      height: 48px;
     
    }
    .info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
      overflow: hidden;
      .name {
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
        color: #1c1c1e;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .details {
        white-space: nowrap;
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        color: #616161;
        display: flex;
        gap: 16px;
        .from strong {
          font-weight: bold;
        }
      }
    }
    .download {
      white-space: nowrap;
      svg path{
        fill: #616161;
      }
    }
    .cancel {
      cursor: pointer;
    }
  }
`;

export default Styled;
