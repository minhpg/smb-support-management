const { useState, useEffect } = require("react");

const usePreviews = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (selectedFiles.length == 0) {
      setPreviews([]);
      return;
    }

    const objectUrls = [];

    for (const selectedFile of selectedFiles) {
      if (selectedFile.type.includes("image"))
        objectUrls.push(URL.createObjectURL(selectedFile));
    }
    setPreviews(objectUrls);

    return () => objectUrls.map((objectUrl) => URL.revokeObjectURL(objectUrl));
  }, [selectedFiles]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFiles([]);
      return;
    }
    setSelectedFiles(e.target.files);
  };

  return {
    selectedFiles,
    onSelectFile,
    previews,
  };
};

export default usePreviews;
