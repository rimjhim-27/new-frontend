const downloadReport = async (reportId: string) => {
  window.open(`/api/reports/${reportId}`, "_blank");
};