{{- define "ska-ser-bar-ui.image" -}}
{{- $tag := coalesce .Values.image.tag (include "ska-ser-bar-ui.appVersion" .) -}}
{{- printf "%s:%s" .Values.image.repository $tag  -}}
{{- end -}}

{{- define "ska-ser-bar-ui.configVersion" -}}
{{ .Values.config | toYaml | sha256sum | substr 0 16 }}
{{- end -}}

{{- define "ska-ser-bar-ui.restApiUrl" -}}
{{- $prefix := "" -}}
{{- $port := "" -}}
{{- if .Values.config.restApi.prefix -}}
{{- $prefix = printf "/%s" (trimPrefix "/" .Values.config.restApi.prefix) -}}
{{- end -}}
{{- if .Values.config.restApi.port -}}
{{- $port = printf ":%s" (toString .Values.config.restApi.port) -}}
{{- end -}}
{{- $restApiNamespace := coalesce .Values.config.restApi.namespace (include "ska-ser-bar-ui.namespace" .) -}}
{{- printf "http://%s.%s.svc%s%s" .Values.config.restApi.service $restApiNamespace $port $prefix -}}
{{- end -}}

{{- define "ska-ser-bar-ui.serviceUrl" -}}
{{- printf "%s.%s.svc" (include "ska-ser-bar-ui.name" .)  (include "ska-ser-bar-ui.namespace" .) -}}
{{- end -}}

{{- define "ska-ser-bar-ui.internalAuthUrl" -}}
{{- $prefix := "" -}}
{{- if .Values.config.prefixWithNamespace -}}
{{- $prefix = printf "/%s" .Release.Namespace -}}
{{- end -}}
{{- $svcUrl := (include "ska-ser-bar-ui.serviceUrl" .) -}}
{{- printf "http://%s%s/api/auth" $svcUrl $prefix -}}
{{- end -}}

{{- define "ska-ser-bar-ui.publicAuthUrl" -}}
{{- $host := printf "http://%s.%s" (include "ska-ser-bar-ui.serviceUrl" .) (.Values.config.cluster_domain) -}}
{{- if .Values.config.host -}}
{{- $host = printf "https://%s" .Values.config.host -}}
{{- end -}}
{{- $prefix := "" -}}
{{- if .Values.config.prefixWithNamespace -}}
{{- $prefix = printf "/%s" .Release.Namespace -}}
{{- end -}}
{{- if .Values.config.prefixWithNamespace -}}
{{- $prefix = printf "/%s" .Release.Namespace -}}
{{- end -}}
{{- $svcUrl := (include "ska-ser-bar-ui.serviceUrl" .) -}}
{{- printf "%s%s/api/auth" $host $prefix -}}
{{- end -}}
