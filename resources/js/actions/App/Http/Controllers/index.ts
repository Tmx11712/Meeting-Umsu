import Api from './Api'
import PublicAttendanceController from './PublicAttendanceController'
import DashboardController from './DashboardController'
import MeetingController from './MeetingController'
import MeetingRecordingController from './MeetingRecordingController'
import TranscriptionController from './TranscriptionController'
import TranscriptCorrectionController from './TranscriptCorrectionController'
import AttendanceController from './AttendanceController'
import MeetingMinuteController from './MeetingMinuteController'
import MeetingDocumentController from './MeetingDocumentController'
import MeetingApprovalController from './MeetingApprovalController'
import ReportController from './ReportController'
import Configuration from './Configuration'
import Teams from './Teams'
import Settings from './Settings'
const Controllers = {
    Api: Object.assign(Api, Api),
PublicAttendanceController: Object.assign(PublicAttendanceController, PublicAttendanceController),
DashboardController: Object.assign(DashboardController, DashboardController),
MeetingController: Object.assign(MeetingController, MeetingController),
MeetingRecordingController: Object.assign(MeetingRecordingController, MeetingRecordingController),
TranscriptionController: Object.assign(TranscriptionController, TranscriptionController),
TranscriptCorrectionController: Object.assign(TranscriptCorrectionController, TranscriptCorrectionController),
AttendanceController: Object.assign(AttendanceController, AttendanceController),
MeetingMinuteController: Object.assign(MeetingMinuteController, MeetingMinuteController),
MeetingDocumentController: Object.assign(MeetingDocumentController, MeetingDocumentController),
MeetingApprovalController: Object.assign(MeetingApprovalController, MeetingApprovalController),
ReportController: Object.assign(ReportController, ReportController),
Configuration: Object.assign(Configuration, Configuration),
Teams: Object.assign(Teams, Teams),
Settings: Object.assign(Settings, Settings),
}

export default Controllers