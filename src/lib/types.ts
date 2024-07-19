export type ToastPayload = {
	text: string;
	class: ToastPayloadClass;
};
export enum ToastPayloadClass {
	success,
	warn,
	error
}

export type BasicUserData = {
	firstName: string;
	last_name: string;
	seminar_group: string;
	seminar_name: string;
	user: string;
};

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

export type ExamSignup = {
	name: string;
	verfahren: string;
	status: string;
	warning_message: string;
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
