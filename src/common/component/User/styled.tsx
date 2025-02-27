import styled from "styled-components";

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  user-select: none;
  &.interactive {
    &:hover,
    &.active {
      background: rgba(116, 127, 141, 0.1);
    }
  }
  .avatar {
    cursor: pointer;
    width: ${({ size }: { size: number }) => `${size}px`};
    height: ${({ size }: { size: number }) => `${size}px`};
    position: relative;
    img {
      object-fit: cover;
      border-radius: 50%;
      width: 100%;
      height: 100%;
    }
    .status {
      position: absolute;
      bottom: -2px;
      right: -6px;
      width: 12px;
      height: 12px;
      box-sizing: content-box;
      border-radius: 50%;
      border: 2px solid #fff;
      &.online {
        background-color: #22c55e;
      }
      &.offline {
        background-color: #a1a1aa;
      }
      &.alert {
        background-color: #dc2626;
      }
    }
  }
  .name {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: #52525b;
    max-width: 190px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /* session nav */
  &.compact {
    padding: 0;
    .avatar .status {
      width: 15px;
      height: 15px;
    }
  }
`;

export default StyledWrapper;
