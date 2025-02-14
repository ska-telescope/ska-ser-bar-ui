## The following should be standard includes
# include core makefile targets for release management

-include .make/base.mk
-include .make/oci.mk
-include .make/helm.mk
-include .make/k8s.mk
-include .make/js.mk

JS_PACKAGE_MANAGER = npm
HELM_RELEASE ?= ska-ser-bar-ui