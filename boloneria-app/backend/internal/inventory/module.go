package inventory

import "go.uber.org/fx"

var Module = fx.Options(
	fx.Provide(NewRepository),
	fx.Provide(NewService),
	fx.Invoke(NewHandler),
)
