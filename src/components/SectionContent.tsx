export const SectionContent = ({ sections }: any) => {
  return (
    <>
      {sections?.map((section: any) => {
        const key = section?.id ?? section?._id;

        return (
          <div
            key={key}
            data-test="rte"
            dangerouslySetInnerHTML={{ __html: section.content }}
            className="ql-editor"
          ></div>
        );
      })}
    </>
  );
};
