export interface IIssue {
  id: string;
  name: string;
  description: string;
  type: number;
  assignee_id: string;
  parent_id: string;
  project_id: string;
  milestone_id: string;
  priority_id: string;
  version_id: string;
  status_id: string;
  display_order: number;
  start_date: string;
  due_date: string;
  estimate_hours: number;
  actual_hours: number;
}

export interface IIssueResponse extends IIssue {
  assignee: any;
  priority: any;
  status: any;
  version: any;
  milestone: any;
  parent: any;
  updated_date: any;
  code: string;
}

export interface IIssueType {
  id: number;
  name: string;
}

export interface IIssueData {
  id: string;
  name: string;
  description: string;
  type: number;
  assignee_id: string;
  parent_id: string;
  project_id: string;
  milestone_id: string;
  priority_id: string;
  version_id: string;
  status_id: string;
  display_order: number;
  start_date: string;
  due_date: string;
  estimate_hours: number;
  actual_hours: number;
}
