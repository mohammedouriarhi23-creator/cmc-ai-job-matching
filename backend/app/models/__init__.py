from app.models.candidate import (
    CandidateProfile,
    CandidateType,
    ProfileStatus,
)
from app.models.cv_extraction import (
    CvExtraction,
    CvExtractionStatus,
)
from app.models.user import User, UserRole
from app.models.candidate_profile_data import CandidateProfileData
__all__ = [
    "User",
    "UserRole",
    "CandidateProfile",
    "CandidateType",
    "ProfileStatus",
    "CvExtraction",
    "CandidateProfileData",
    "CvExtractionStatus",
]