import { updateDraftMarkdown, updateDraftMixedText } from "../../app/slices/ui";
import { useAppDispatch, useAppSelector } from "../../app/store";

const useDraft = ({ context = "user", id = 0 }: { context: "user" | "channel"; id: number }) => {
  const dispatch = useAppDispatch();
  const _key = `${context}_${id}`;
  const { draftMarkdown, draftMixedText } = useAppSelector((store) => {
    return {
      draftMarkdown: store.ui.draftMarkdown,
      draftMixedText: store.ui.draftMixedText
    };
  });

  const getUpdateDraft = (type = "mixed") => {
    const update = type == "mixed" ? updateDraftMixedText : updateDraftMarkdown;
    return (value: string) => {
      dispatch(update({ key: _key, value }));
    };
  };

  const getDraft = (type = "mixed") => {
    return type == "mixed" ? draftMixedText[_key] : draftMarkdown[_key];
  };

  return { getDraft, getUpdateDraft };
};
export default useDraft;
