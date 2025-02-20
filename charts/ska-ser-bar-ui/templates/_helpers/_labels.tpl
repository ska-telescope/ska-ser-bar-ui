{{- define "ska-ser-bar-ui.labels.merge" -}}
{{- $labels := dict -}}
{{- range . -}}
  {{- $labels = merge $labels (fromYaml .) -}}
{{- end -}}
{{- with $labels -}}
  {{- toYaml $labels -}}
{{- end -}}
{{- end -}}

{{- define "ska-ser-bar-ui.labels.helm" -}}
helm.sh/chart: {{ template "ska-ser-bar-ui.chart" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "ska-ser-bar-ui.labels.version" -}}
app.kubernetes.io/version: {{ template "ska-ser-bar-ui.chartVersion" . }}
{{- end -}}

{{- define "ska-ser-bar-ui.matchLabels" -}}
app.kubernetes.io/part-of: {{ template "ska-ser-bar-ui.fullname" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{- define "ska-ser-bar-ui.labels" -}}
{{- template "ska-ser-bar-ui.labels.merge" (list
  (include "ska-ser-bar-ui.labels.helm" .)
  (include "ska-ser-bar-ui.labels.version" .)
  (include "ska-ser-bar-ui.matchLabels" .)
  (toYaml .Values.labels)
) -}}
{{- end -}}

{{- define "ska-ser-bar-ui.labels.component" -}}
app.kubernetes.io/component: {{ . }}
{{- end -}}

{{- define "ska-ser-bar-ui.labels.componentVersion" -}}
app.kubernetes.io/componentVersion: {{ . }}
{{- end -}}

{{- define "ska-ser-bar-ui.labels.name" -}}
app.kubernetes.io/name: {{ . }}
{{- end -}}
