{{- define "ska-ser-bar-ui.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "ska-ser-bar-ui.fullname" -}}
{{- if .Values.fullnameOverride -}}
  {{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
  {{- $name := default .Chart.Name .Values.nameOverride -}}
  {{- if contains $name .Release.Name -}}
    {{- .Release.Name | trunc 63 | trimSuffix "-" -}}
  {{- else -}}
    {{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
  {{- end -}}
{{- end -}}
{{- end -}}

{{- define "ska-ser-bar-ui.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "ska-ser-bar-ui.chartVersion" -}}
{{- .Chart.Version -}}
{{- end -}}

{{- define "ska-ser-bar-ui.appVersion" -}}
{{- .Chart.AppVersion -}}
{{- end -}}

{{- define "ska-ser-bar-ui.namespace" -}}
{{ .Release.Namespace }}
{{- end -}}
