import MeetingApiController from './MeetingApiController'
import AttendanceApiController from './AttendanceApiController'
const Api = {
    MeetingApiController: Object.assign(MeetingApiController, MeetingApiController),
AttendanceApiController: Object.assign(AttendanceApiController, AttendanceApiController),
}

export default Api
