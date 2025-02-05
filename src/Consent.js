import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Checkbox,
  FormControlLabel,
  Paper,
  Button,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ref, update, get } from "firebase/database";
import { db } from "./firebase";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  borderRadius: "12px",
  boxShadow: "0 3px 10px rgba(0, 0, 0, 0.08)",
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(2),
  "& .label": {
    fontWeight: "bold",
    minWidth: "100px",
    color: theme.palette.text.secondary,
  },
}));

function Consent() {
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [referralData, setReferralData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const params = new URLSearchParams(window.location.search);
  const referralId = params.get("referralId");

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!referralId) {
        setIsLoading(false);
        return;
      }

      try {
        const referralRef = ref(db, `referrals/${referralId}`);
        const snapshot = await get(referralRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          setReferralData(data);
          if (data.status !== "PENDING") {
            setIsCompleted(true);
          }
        }
      } catch (error) {
        console.error("데이터 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferralData();
  }, [referralId]);

  const handleSubmit = async (action) => {
    if (!isChecked || !referralId || isCompleted) return;

    setIsSubmitting(true);
    try {
      const referralRef = ref(db, `referrals/${referralId}`);
      const updatedData = {
        status: action === "approve" ? "APPROVED" : "REJECTED",
        updatedAt: new Date().toISOString(),
      };

      await update(referralRef, updatedData);

      setReferralData({
        ...referralData,
        ...updatedData,
      });

      setIsCompleted(true);

      if (window.opener) {
        window.opener.postMessage(
          {
            type:
              action === "approve" ? "CONSENT_COMPLETED" : "CONSENT_REJECTED",
            referralId,
          },
          "*"
        );
      }
    } catch (error) {
      console.error("처리 실패:", error);
      alert("처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <StyledPaper>
          <Typography align="center">로딩 중...</Typography>
        </StyledPaper>
      </Container>
    );
  }

  if (!referralId || !referralData) {
    return (
      <Container maxWidth="sm">
        <StyledPaper>
          <Typography color="error" align="center">
            유효하지 않은 접근입니다.
          </Typography>
        </StyledPaper>
      </Container>
    );
  }

  const { hospitalName, department, doctorName, status } = referralData;

  return (
    <Container maxWidth="sm">
      <StyledPaper sx={{ opacity: isCompleted ? 0.7 : 1 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontWeight: "bold",
            color: status !== "PENDING" ? "#4CAF50" : "#1a73e8",
          }}
        >
          {status !== "PENDING" ? "처리 완료된 동의서" : "진료 정보 공유 동의"}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <InfoRow>
            <Typography className="label">병원:</Typography>
            <Typography>{hospitalName}</Typography>
          </InfoRow>

          <InfoRow>
            <Typography className="label">진료과:</Typography>
            <Typography>{department}</Typography>
          </InfoRow>

          <InfoRow>
            <Typography className="label">의사:</Typography>
            <Typography>{doctorName}</Typography>
          </InfoRow>

          {status !== "PENDING" && (
            <InfoRow>
              <Typography className="label">처리상태:</Typography>
              <Typography sx={{ color: "#4CAF50", fontWeight: "bold" }}>
                동의 완료
              </Typography>
            </InfoRow>
          )}
        </Box>

        {status === "PENDING" ? (
          <>
            <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1, mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                위 의료진에게 귀하의 의료 데이터가 전송됩니다. 전송된 데이터는
                진료 목적으로만 사용되며, 관련 법률에 따라 안전하게 보호됩니다.
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  disabled={isCompleted}
                />
              }
              label="위 내용을 확인했습니다"
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                disabled={!isChecked || isSubmitting || isCompleted}
                onClick={() => handleSubmit("reject")}
                sx={{
                  color: "#d32f2f",
                  borderColor: "#d32f2f",
                  "&:hover": {
                    backgroundColor: "#ffebee",
                    borderColor: "#d32f2f",
                  },
                }}
              >
                {isSubmitting ? "처리중..." : "거절"}
              </Button>

              <Button
                variant="contained"
                fullWidth
                size="large"
                disabled={!isChecked || isSubmitting || isCompleted}
                onClick={() => handleSubmit("approve")}
                sx={{
                  bgcolor: "#1a73e8",
                  "&:hover": { bgcolor: "#1557b0" },
                }}
              >
                {isSubmitting ? "처리중..." : "동의"}
              </Button>
            </Box>
          </>
        ) : (
          <Typography
            variant="body1"
            align="center"
            sx={{
              color: status === "APPROVED" ? "#4CAF50" : "#d32f2f",
              fontWeight: "bold",
              mt: 2,
            }}
          >
            {status === "APPROVED"
              ? "동의 처리가 완료된 동의서입니다"
              : "거절 처리가 완료된 동의서입니다"}
          </Typography>
        )}
      </StyledPaper>
    </Container>
  );
}

export default Consent;
