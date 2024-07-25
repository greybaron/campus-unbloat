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
	backgroundColor: string;
	textColor: string;
}

export interface Event {
	start: Date;
	end: Date;
	title: string;
	backgroundColor: string;
	textColor: string;
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
	sub_meals: Array<MensaSubMeal>;
};

export type MensaSubMeal = {
	name: string;
	additional_ingredients: Array<string>;
	price: string;
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
};

export enum SignupOrVerfahren {
	signup,
	verfahren
}
