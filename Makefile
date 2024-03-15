.PHONY: help resource

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

resource: ## Create a new resource
	$(eval TMP_DIR := $(shell mktemp -d))
	$(eval ORIGIN := Sample)
	$(eval LOWER_ORIGIN := $(shell echo $(ORIGIN) | tr A-Z a-z))
	$(eval LOWER_NAME := $(shell echo $(name) | tr A-Z a-z))

	@echo 'Creating resource "$(name)"...'
	@cp -r ./scaffold/$(LOWER_ORIGIN)/* $(TMP_DIR)

	@find $(TMP_DIR) -name '*$(ORIGIN)*' | xargs -I % bash -c 'mv -f % $$(echo % | sed "s/$(ORIGIN)/$(name)/g") 2>/dev/null; true'
	@find $(TMP_DIR) -name '*$(LOWER_ORIGIN)*' | xargs -I % bash -c 'mv -f % $$(echo % | sed "s/$(LOWER_ORIGIN)/$(LOWER_NAME)/g") 2>/dev/null; true'

	@find $(TMP_DIR) -type f -exec sed -i 's/$(ORIGIN)/$(name)/g' {} \;
	@find $(TMP_DIR) -type f -exec sed -i 's/$(LOWER_ORIGIN)/$(LOWER_NAME)/g' {} \;
	
	@cp -r $(TMP_DIR)/* ./

	@echo 'Resource "$(name)" created'
	@echo 'Just add "$(name)sModule" to imports at app.module.ts file.'
