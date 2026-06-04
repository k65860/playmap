import { useMutation, useQuery } from "react-query";
import styled from "styled-components";
import { alert, http } from "../../../assets/functions";
import Button from "../../../layouts/button";
import * as XLSX from "xlsx";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { NoneItem } from "..";

interface Props {
  USR_SQ: number;
}

export default ({ USR_SQ }: Props) => {
  // isLoading 상태를 각 버튼을 위해 관리
  const { isLoading: downloadTypeLoading, data: downloadType } = useQuery<
    Common.Download[]
  >(["/download", USR_SQ], async () => {
    const { data } = await http.get("/download");
    if (!data?.result) return;
    return data?.body ?? [];
  });

  const [loadingCC_CD, setLoadingCC_CD] = useState<number | null>(null); // 로딩 상태를 관리하는 state

  const { mutate: downloadData } = useMutation(
    async (CC_CD: number) => {
      const ask = window.confirm("데이터를 엑셀파일로 다운로드 하시겠습니까?");
      if (!ask) return;

      setLoadingCC_CD(CC_CD); // 다운로드 시작 시 해당 CC_CD를 로딩 상태로 설정
      const url = `/download/${CC_CD}?USR_SQ=${USR_SQ}`;
      const { data } = await http.get(url);
      if (!data?.result) return alert.error(data?.message);

      downloadExcel(data?.body);
      setLoadingCC_CD(null); // 다운로드 후 로딩 상태 초기화
    },
    {
      onError: (error) => {
        console.error("다운로드 실패", error);
        setLoadingCC_CD(null); // 오류 발생 시 로딩 상태 초기화
      },
    }
  );

  const downloadExcel = (excelData: any) => {
    if (!excelData) return alert.error("데이터를 찾을 수 없습니다.");
    try {
      const workbook = XLSX.utils.book_new();

      for (const [sheetName, rows] of Object.entries(excelData.SHEET_LIST)) {
        if (!Array.isArray(rows) || !Array.isArray(rows[0])) {
          continue;
        }

        const worksheet = XLSX.utils.aoa_to_sheet(rows);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      }

      // 다운로드
      XLSX.writeFile(workbook, excelData.FILE_NAME + ".xlsx");
    } catch (error) {
      console.error("엑셀 파일 생성 중 오류가 발생했습니다.", error);
    }
  };

  return (
    <Container>
      {downloadTypeLoading ? (
        <>
          <Skeleton height={35} borderRadius={35} />
          <Skeleton height={35} borderRadius={35} />
          <Skeleton height={35} borderRadius={35} />
        </>
      ) : !downloadType?.length ? (
        <NoneItem>항목이 없어요.</NoneItem>
      ) : (
        downloadType?.map((item) => (
          <Button
            loading={loadingCC_CD === item?.CC_CD}
            onClick={() => downloadData(item?.CC_CD)}
            key={item?.CC_SQ}
          >
            {item?.CC_NM}
          </Button>
        ))
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Box = styled.div``;
