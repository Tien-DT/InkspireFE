import { ProjectStatus } from '~/types/recruitment.type'

export interface RecruitmentStatusStyle {
  label: string
  badgeClass: string
  dotClass: string
}

const defaultStyle: RecruitmentStatusStyle = {
  label: 'Không xác định',
  badgeClass: 'border border-border/60 bg-muted/40 text-muted-foreground',
  dotClass: 'bg-muted-foreground/60'
}

export const RECRUITMENT_STATUS_STYLES: Record<ProjectStatus, RecruitmentStatusStyle> = {
  [ProjectStatus.DRAFT]: {
    label: 'Bản nháp',
    badgeClass: 'border border-slate-200 bg-slate-50 text-slate-700',
    dotClass: 'bg-slate-500'
  },
  [ProjectStatus.ACTIVE]: {
    label: 'Đang tuyển',
    badgeClass: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
    dotClass: 'bg-emerald-500'
  },
  [ProjectStatus.CLOSED]: {
    label: 'Đã đóng',
    badgeClass: 'border border-amber-200 bg-amber-50 text-amber-700',
    dotClass: 'bg-amber-500'
  },
  [ProjectStatus.COMPLETED]: {
    label: 'Hoàn thành',
    badgeClass: 'border border-blue-200 bg-blue-50 text-blue-700',
    dotClass: 'bg-blue-500'
  }
}

export const getRecruitmentStatusStyle = (status: number | ProjectStatus): RecruitmentStatusStyle => {
  return RECRUITMENT_STATUS_STYLES[status as ProjectStatus] ?? defaultStyle
}
