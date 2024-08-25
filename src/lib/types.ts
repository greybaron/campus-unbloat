import type { ToastSettings } from '@skeletonlabs/skeleton';

export type ToastPayload = {
	text: string;
	class: ToastPayloadClass;
};
export enum ToastPayloadClass {
	success,
	warn,
	error
}

export function getToastSettings(payload: ToastPayload): ToastSettings {
	let bg: string;
	switch (payload.class) {
		case ToastPayloadClass.success:
			bg = 'variant-filled-success';
			break;
		case ToastPayloadClass.warn:
			bg = 'variant-filled-warning';
			break;
		case ToastPayloadClass.error:
			bg = 'variant-filled-error';
			break;
	}
	if (payload.class == ToastPayloadClass.error) {
		const t: ToastSettings = {
			message: payload.text,
			background: bg,
			autohide: false
		};

		return t;
	} else {
		const t: ToastSettings = {
			message: payload.text,
			background: bg,
			timeout: 10000
		};

		return t;
	}
}

export interface EventUnix {
	start: number;
	end: number;
	title: string;
	room: string;
	instructor: string;
	textColor: string;
	remarks: string;
	color: string;
}

export interface Event {
	start: Date;
	end: Date;
	title: string;
	textColor: string;
	room: string;
	instructor: string;
	remarks: string;
	color: string;
}

//////// API response types
export type BasicUserData = {
	first_name: string;
	last_name: string;
	seminar_group: string;
	seminar_name: string;
	user: string;
};

export type CampusDualSignupOption = {
	name: string;
	verfahren: string;
	pruefart: string;
	status: string;
	signup_information: string;
	exam_date?: string;
	exam_time?: string;
	exam_room?: string;
	warning_message?: string;
	signup_until?: string;
	internal_metadata?: CampusExamMetadata;
};

export type CampusDualVerfahrenOption = {
	name: string;
	verfahren: string;
	pruefart: string;
	status: string;
	signup_information: string;
	exam_date?: string;
	exam_time?: string;
	exam_room?: string;
	warning_message?: string;
	signoff_until?: string;
	internal_metadata?: CampusExamMetadata;
};

export type CampusExamMetadata = {
	assessment: string;
	peryr: string;
	perid: string;
	offerno: string;
};

export type ExamStats = {
	total: number;
	successful: number;
	unsuccessful: number;
	unassessed: number;
	booked: number;
	finished: number;
	ronmodus: number;
};

export type Mensa = {
	id: number;
	name: string;
};

export type MensaMeal = {
	meal_type: string;
	sub_meals: MensaSubMeal[];
};

export type MensaSubMeal = {
	name: string;
	additional_ingredients: string[];
	price: string;
	allergens?: string;
	variations?: MealVariations[];
};

type MealVariations = {
	name: string;
	allergens_and_add: string;
};

export type CampusDualGrade = {
	name: string;
	grade: string;
	total_passed?: boolean;
	credit_points: number;
	akad_period: string;
	subgrades: CampusDualSubGrade[];
};

export type CampusDualSubGrade = {
	name: string;
	grade: string;
	passed?: boolean;
	beurteilung: string;
	bekanntgabe: string;
	wiederholung?: string;
	akad_period: string;
	internal_metadata?: CampusGradeMetadata;
};

export type CampusGradeMetadata = {
	module: string;
	peryr: string;
	perid: string;
};

export type CampusGradeStats = {
	one: number;
	two: number;
	three: number;
	four: number;
	ronmodus: number;
};

export enum SignupOrVerfahren {
	signup,
	verfahren
}

export interface CdReminders {
	electives: number;
	exams: number;
	latest: Latest[];
	semester: number;
	upcoming: Upcoming[];
}

export interface Latest {
	acad_session: string;
	acad_year: string;
	agrdate: string;
	agrtype: string;
	awobject: string;
	awobject_short: string;
	awotype: string;
	awstatus: string;
	bookdate: string;
	bookreason: string;
	cpgraded: string;
	cpunit: string;
	gradesymbol: string;
}

export interface Upcoming {
	beguz: string;
	comment: string;
	enduz: string;
	evdat: string;
	instructor: string;
	location: string;
	objid: string;
	room: string;
	sinstructor: string;
	sm_short: string;
	sm_stext: string;
	sroom: string;
}

export type Timeline = {
	fachsemester: TimelineEvent[];
	theoriesemester: TimelineEvent[];
	praxissemester: TimelineEvent[];
	specials: TimelineEvent[];
};

export type TimelineEvent = {
	name: string;
	description: string;
	color: string;
	start: string;
	end: string;
};

export interface CampusExamDetails {
	ev_agrtype_text: string;
	ev_audtype_text: string;
	ev_continue_indicator: string;
	ev_dereg_end: string;
	ev_dereg_endtime: string;
	ev_duration: string;
	ev_durunit: string;
	ev_exambegtime: string;
	ev_examdate: string;
	ev_examendtime: string;
	ev_examorg_text: string;
	ev_examorg_longtext: string;
	ev_instructor: string;
	ev_location_short: string;
	ev_location_stext: string;
	ev_obtype_text: string;
	ev_reason: string;
	ev_regis_begin: string;
	ev_regis_begtime: string;
	ev_regis_end: string;
	ev_regis_endtime: string;
	ev_room_short: string;
	ev_room_stext: string;
	ev_short: string;
	ev_stext: string;
}
