"use client";

import * as React from "react";

import { Example, ExampleWrapper } from "@/components/example";
import { cn } from "@/lib/utils";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	PlusIcon,
	BluetoothIcon,
	MoreVerticalIcon,
	FileIcon,
	FolderIcon,
	FolderOpenIcon,
	FileCodeIcon,
	MoreHorizontalIcon,
	FolderSearchIcon,
	SaveIcon,
	DownloadIcon,
	EyeIcon,
	LayoutIcon,
	PaletteIcon,
	SunIcon,
	MoonIcon,
	MonitorIcon,
	UserIcon,
	CreditCardIcon,
	SettingsIcon,
	KeyboardIcon,
	LanguagesIcon,
	BellIcon,
	MailIcon,
	ShieldIcon,
	HelpCircleIcon,
	FileTextIcon,
	LogOutIcon,
	MicIcon,
	InfoIcon,
	CheckIcon,
	ChevronRightIcon,
	LoaderIcon,
	UsersIcon,
	SearchIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
	BadgeCheck,
	Loader,
	CircleX,
	CirclePause,
} from "lucide-react";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Checkbox } from "./ui/checkbox";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";

export function ComponentExample() {
	return (
		<ExampleWrapper>
			<CardExample />
			<FormExample />
			<PaymentMethodExample />
			<TeamMembersExample />
			<StatusPillsExample />
			<MessageInputExample />
			<SearchWithResultsExample />
			<UrlInputExample />
			<TwoFactorExample />
			<ProfileVerifiedExample />
			<ComputeEnvironmentExample />
			<NumberStepperExample />
			<ToggleExample />
			<TermsCheckboxExample />
			<PaginationExample />
			<SegmentedExample />
			<ProcessingExample />
			<SkeletonCardExample />
		</ExampleWrapper>
	);
}

function CardExample() {
	return (
		<Example title="Card" className="items-center justify-center">
			<Card className="relative w-full max-w-sm overflow-hidden pt-0">
				<div className="bg-primary absolute inset-0 z-30 aspect-video opacity-50 mix-blend-color" />
				<img
					src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					alt="Photo by mymind on Unsplash"
					title="Photo by mymind on Unsplash"
					className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
				/>
				<CardHeader>
					<CardTitle>Observability Plus is replacing Monitoring</CardTitle>
					<CardDescription>
						Switch to the improved way to explore your data, with natural
						language. Monitoring will no longer be available on the Pro plan in
						November, 2025
					</CardDescription>
				</CardHeader>
				<CardFooter>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button>
								<PlusIcon data-icon="inline-start" />
								Show Dialog
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent size="sm">
							<AlertDialogHeader>
								<AlertDialogMedia>
									<BluetoothIcon />
								</AlertDialogMedia>
								<AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
								<AlertDialogDescription>
									Do you want to allow the USB accessory to connect to this
									device?
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
								<AlertDialogAction>Allow</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
					<Badge variant="secondary" className="ml-auto">
						Warning
					</Badge>
				</CardFooter>
			</Card>
		</Example>
	);
}

const frameworks = [
	"Next.js",
	"SvelteKit",
	"Nuxt.js",
	"Remix",
	"Astro",
] as const;

function FormExample() {
	const [notifications, setNotifications] = React.useState({
		email: true,
		sms: false,
		push: true,
	});
	const [theme, setTheme] = React.useState("light");

	return (
		<Example title="Form">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>User Information</CardTitle>
					<CardDescription>Please fill in your details below</CardDescription>
					<CardAction>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<MoreVerticalIcon />
									<span className="sr-only">More options</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuGroup>
									<DropdownMenuLabel>File</DropdownMenuLabel>
									<DropdownMenuItem>
										<FileIcon />
										New File
										<DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<FolderIcon />
										New Folder
										<DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
									</DropdownMenuItem>
									<DropdownMenuSub>
										<DropdownMenuSubTrigger>
											<FolderOpenIcon />
											Open Recent
										</DropdownMenuSubTrigger>
										<DropdownMenuPortal>
											<DropdownMenuSubContent>
												<DropdownMenuGroup>
													<DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
													<DropdownMenuItem>
														<FileCodeIcon />
														Project Alpha
													</DropdownMenuItem>
													<DropdownMenuItem>
														<FileCodeIcon />
														Project Beta
													</DropdownMenuItem>
													<DropdownMenuSub>
														<DropdownMenuSubTrigger>
															<MoreHorizontalIcon />
															More Projects
														</DropdownMenuSubTrigger>
														<DropdownMenuPortal>
															<DropdownMenuSubContent>
																<DropdownMenuItem>
																	<FileCodeIcon />
																	Project Gamma
																</DropdownMenuItem>
																<DropdownMenuItem>
																	<FileCodeIcon />
																	Project Delta
																</DropdownMenuItem>
															</DropdownMenuSubContent>
														</DropdownMenuPortal>
													</DropdownMenuSub>
												</DropdownMenuGroup>
												<DropdownMenuSeparator />
												<DropdownMenuGroup>
													<DropdownMenuItem>
														<FolderSearchIcon />
														Browse...
													</DropdownMenuItem>
												</DropdownMenuGroup>
											</DropdownMenuSubContent>
										</DropdownMenuPortal>
									</DropdownMenuSub>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<SaveIcon />
										Save
										<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<DownloadIcon />
										Export
										<DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuLabel>View</DropdownMenuLabel>
									<DropdownMenuCheckboxItem
										checked={notifications.email}
										onCheckedChange={(checked) =>
											setNotifications({
												...notifications,
												email: checked === true,
											})
										}
									>
										<EyeIcon />
										Show Sidebar
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={notifications.sms}
										onCheckedChange={(checked) =>
											setNotifications({
												...notifications,
												sms: checked === true,
											})
										}
									>
										<LayoutIcon />
										Show Status Bar
									</DropdownMenuCheckboxItem>
									<DropdownMenuSub>
										<DropdownMenuSubTrigger>
											<PaletteIcon />
											Theme
										</DropdownMenuSubTrigger>
										<DropdownMenuPortal>
											<DropdownMenuSubContent>
												<DropdownMenuGroup>
													<DropdownMenuLabel>Appearance</DropdownMenuLabel>
													<DropdownMenuRadioGroup
														value={theme}
														onValueChange={setTheme}
													>
														<DropdownMenuRadioItem value="light">
															<SunIcon />
															Light
														</DropdownMenuRadioItem>
														<DropdownMenuRadioItem value="dark">
															<MoonIcon />
															Dark
														</DropdownMenuRadioItem>
														<DropdownMenuRadioItem value="system">
															<MonitorIcon />
															System
														</DropdownMenuRadioItem>
													</DropdownMenuRadioGroup>
												</DropdownMenuGroup>
											</DropdownMenuSubContent>
										</DropdownMenuPortal>
									</DropdownMenuSub>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuLabel>Account</DropdownMenuLabel>
									<DropdownMenuItem>
										<UserIcon />
										Profile
										<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<CreditCardIcon />
										Billing
									</DropdownMenuItem>
									<DropdownMenuSub>
										<DropdownMenuSubTrigger>
											<SettingsIcon />
											Settings
										</DropdownMenuSubTrigger>
										<DropdownMenuPortal>
											<DropdownMenuSubContent>
												<DropdownMenuGroup>
													<DropdownMenuLabel>Preferences</DropdownMenuLabel>
													<DropdownMenuItem>
														<KeyboardIcon />
														Keyboard Shortcuts
													</DropdownMenuItem>
													<DropdownMenuItem>
														<LanguagesIcon />
														Language
													</DropdownMenuItem>
													<DropdownMenuSub>
														<DropdownMenuSubTrigger>
															<BellIcon />
															Notifications
														</DropdownMenuSubTrigger>
														<DropdownMenuPortal>
															<DropdownMenuSubContent>
																<DropdownMenuGroup>
																	<DropdownMenuLabel>
																		Notification Types
																	</DropdownMenuLabel>
																	<DropdownMenuCheckboxItem
																		checked={notifications.push}
																		onCheckedChange={(checked) =>
																			setNotifications({
																				...notifications,
																				push: checked === true,
																			})
																		}
																	>
																		<BellIcon />
																		Push Notifications
																	</DropdownMenuCheckboxItem>
																	<DropdownMenuCheckboxItem
																		checked={notifications.email}
																		onCheckedChange={(checked) =>
																			setNotifications({
																				...notifications,
																				email: checked === true,
																			})
																		}
																	>
																		<MailIcon />
																		Email Notifications
																	</DropdownMenuCheckboxItem>
																</DropdownMenuGroup>
															</DropdownMenuSubContent>
														</DropdownMenuPortal>
													</DropdownMenuSub>
												</DropdownMenuGroup>
												<DropdownMenuSeparator />
												<DropdownMenuGroup>
													<DropdownMenuItem>
														<ShieldIcon />
														Privacy & Security
													</DropdownMenuItem>
												</DropdownMenuGroup>
											</DropdownMenuSubContent>
										</DropdownMenuPortal>
									</DropdownMenuSub>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem>
										<HelpCircleIcon />
										Help & Support
									</DropdownMenuItem>
									<DropdownMenuItem>
										<FileTextIcon />
										Documentation
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem variant="destructive">
										<LogOutIcon />
										Sign Out
										<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</CardAction>
				</CardHeader>
				<CardContent>
					<form>
						<FieldGroup>
							<div className="grid grid-cols-2 gap-4">
								<Field>
									<FieldLabel htmlFor="small-form-name">Name</FieldLabel>
									<Input
										id="small-form-name"
										placeholder="Enter your name"
										required
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="small-form-role">Role</FieldLabel>
									<Select defaultValue="">
										<SelectTrigger id="small-form-role">
											<SelectValue placeholder="Select a role" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="developer">Developer</SelectItem>
												<SelectItem value="designer">Designer</SelectItem>
												<SelectItem value="manager">Manager</SelectItem>
												<SelectItem value="other">Other</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</Field>
							</div>
							<Field>
								<FieldLabel htmlFor="small-form-framework">
									Framework
								</FieldLabel>
								<Combobox items={frameworks}>
									<ComboboxInput
										id="small-form-framework"
										placeholder="Select a framework"
										required
									/>
									<ComboboxContent>
										<ComboboxEmpty>No frameworks found.</ComboboxEmpty>
										<ComboboxList>
											{(item) => (
												<ComboboxItem key={item} value={item}>
													{item}
												</ComboboxItem>
											)}
										</ComboboxList>
									</ComboboxContent>
								</Combobox>
							</Field>
							<Field>
								<FieldLabel htmlFor="small-form-comments">Comments</FieldLabel>
								<Textarea
									id="small-form-comments"
									placeholder="Add any additional comments"
								/>
							</Field>
							<Field orientation="horizontal">
								<Button type="submit">Submit</Button>
								<Button variant="outline" type="button">
									Cancel
								</Button>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</Example>
	);
}

function PaymentMethodExample() {
	return (
		<Example title="Payment Method" className="items-center justify-center">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Payment Method</CardTitle>
					<CardDescription>
						All transactions are secure and encrypted.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="flex flex-col gap-4">
						<Field>
							<FieldLabel htmlFor="card-name">Name on Card</FieldLabel>
							<Input id="card-name" placeholder="John Doe" />
						</Field>
						<Field>
							<FieldLabel htmlFor="card-number">Card Number</FieldLabel>
							<Input id="card-number" placeholder="1234 5678 9012 3456" />
							<p className="text-muted-foreground text-xs">
								Enter your 16-digit number.
							</p>
						</Field>
						<div className="grid grid-cols-[1fr_80px_80px] gap-4">
							<Field>
								<FieldLabel htmlFor="card-cvv">CVV</FieldLabel>
								<Input id="card-cvv" placeholder="123" />
							</Field>
							<Field>
								<FieldLabel htmlFor="card-month">Month</FieldLabel>
								<Select defaultValue="">
									<SelectTrigger id="card-month">
										<SelectValue placeholder="MM" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{[
												"01",
												"02",
												"03",
												"04",
												"05",
												"06",
												"07",
												"08",
												"09",
												"10",
												"11",
												"12",
											].map((m) => (
												<SelectItem key={m} value={m}>
													{m}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</Field>
							<Field>
								<FieldLabel htmlFor="card-year">Year</FieldLabel>
								<Select defaultValue="">
									<SelectTrigger id="card-year">
										<SelectValue placeholder="YYYY" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{["2025", "2026", "2027", "2028", "2029", "2030"].map(
												(y) => (
													<SelectItem key={y} value={y}>
														{y}
													</SelectItem>
												),
											)}
										</SelectGroup>
									</SelectContent>
								</Select>
							</Field>
						</div>
						<div>
							<p className="text-sm font-medium mb-1">Billing Address</p>
							<p className="text-muted-foreground text-xs mb-3">
								The billing address associated with your payment method.
							</p>
							<Field orientation="horizontal">
								<Checkbox
									id="terms-checkbox-2"
									name="terms-checkbox-2"
									defaultChecked
								/>
								<FieldContent>
									<FieldLabel htmlFor="terms-checkbox-2">
										Same as shipping address
									</FieldLabel>
								</FieldContent>
							</Field>
						</div>
						<Field>
							<FieldLabel htmlFor="comments">Comments</FieldLabel>
							<Textarea
								id="comments"
								placeholder="Add any additional comments."
							/>
						</Field>
						<div className="flex gap-2">
							<Button type="submit">Submit</Button>
							<Button variant="outline" type="button">
								Cancel
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</Example>
	);
}

function TeamMembersExample() {
	return (
		<Example title="Team Members" className="items-center justify-center">
			<Card className="w-full max-w-sm">
				<div className="w-full flex justify-center">
					<div className="bg-muted flex size-8 items-center justify-center rounded-full">
						<UsersIcon className="text-muted-foreground" />
					</div>
				</div>
				<CardHeader className="text-center">
					<CardTitle>No Team Members</CardTitle>
					<CardDescription>
						Invite your team to collaborate on this project.
					</CardDescription>
				</CardHeader>
				<CardContent className="text-center">
					<Button>
						<PlusIcon data-icon="inline-start" />
						Invite Members
					</Button>
				</CardContent>
			</Card>
		</Example>
	);
}

function StatusPillsExample() {
	return (
		<Example title="Status">
			<div className="flex flex-wrap gap-2">
				<Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
					<Loader />
					In Progress
				</Badge>
				<Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
					<BadgeCheck />
					Completed
				</Badge>
				<Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
					<CirclePause />
					Pending
				</Badge>
				<Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
					<CircleX />
					Failed
				</Badge>
			</div>
		</Example>
	);
}

function MessageInputExample() {
	return (
		<Example title="Message input">
			<InputGroup className="max-w-md">
				<InputGroupAddon align="inline-start">
					<Button variant="ghost" size="icon" type="button" className="size-8">
						<PlusIcon className="size-4" />
						<span className="sr-only">Add</span>
					</Button>
				</InputGroupAddon>
				<InputGroupInput placeholder="Send a message..." />
				<InputGroupAddon align="inline-end">
					<Button variant="ghost" size="icon" type="button" className="size-8">
						<MicIcon className="size-4" />
						<span className="sr-only">Microphone</span>
					</Button>
				</InputGroupAddon>
			</InputGroup>
		</Example>
	);
}

function SearchWithResultsExample() {
	return (
		<Example title="Search">
			<div className="flex max-w-md flex-col gap-2">
				<InputGroup>
					<InputGroupAddon align="inline-start">
						<SearchIcon className="size-4" />
					</InputGroupAddon>
					<InputGroupInput placeholder="Search..." />
				</InputGroup>
				<p className="text-muted-foreground text-sm">12 results</p>
			</div>
		</Example>
	);
}

function UrlInputExample() {
	return (
		<Example title="URL input">
			<InputGroup className="max-w-md">
				<InputGroupInput
					defaultValue="https://example.com"
					className="font-mono"
				/>
				<InputGroupAddon align="inline-end">
					<Button variant="ghost" size="icon" type="button">
						<InfoIcon />
						<span className="sr-only">Info</span>
					</Button>
				</InputGroupAddon>
			</InputGroup>
		</Example>
	);
}

function TwoFactorExample() {
	return (
		<Example
			title="Two-factor authentication"
			className="items-center justify-center"
		>
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Two-factor authentication</CardTitle>
					<CardDescription>Verify via email or phone number.</CardDescription>
				</CardHeader>
				<CardContent>
					<Button size="sm">Enable</Button>
				</CardContent>
			</Card>
		</Example>
	);
}

function ProfileVerifiedExample() {
	return (
		<Example title="Profile status">
			<button
				type="button"
				className="text-foreground hover:bg-muted flex w-full max-w-sm items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors"
			>
				<CheckIcon className="text-primary size-5 shrink-0" />
				<span className="font-medium">Your profile has been verified.</span>
				<ChevronRightIcon className="text-muted-foreground ml-auto size-4" />
			</button>
		</Example>
	);
}

function ComputeEnvironmentExample() {
	const [env, setEnv] = React.useState("kubernetes");
	return (
		<Example
			title="Compute Environment"
			className="items-center justify-center"
		>
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Compute Environment</CardTitle>
					<CardDescription>
						Select the compute environment for your cluster.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-3">
					<button
						type="button"
						onClick={() => setEnv("kubernetes")}
						className={cn(
							"flex items-start gap-4 rounded-lg border p-4 text-left transition-colors",
							env === "kubernetes"
								? "border-primary bg-primary/5"
								: "border-border hover:bg-muted/50",
						)}
					>
						<span
							className={cn(
								"mt-0.5 size-4 shrink-0 rounded-full border-2",
								env === "kubernetes"
									? "border-primary bg-primary"
									: "border-muted-foreground",
							)}
						/>
						<div>
							<p className="font-medium">Kubernetes</p>
							<p className="text-muted-foreground text-sm">
								Run GPU workloads on a K8s configured cluster. This is the
								default.
							</p>
						</div>
					</button>
					<button
						type="button"
						onClick={() => setEnv("vm")}
						className={cn(
							"flex items-start gap-4 rounded-lg border p-4 text-left transition-colors",
							env === "vm"
								? "border-primary bg-primary/5"
								: "border-border hover:bg-muted/50",
						)}
					>
						<span
							className={cn(
								"mt-0.5 size-4 shrink-0 rounded-full border-2",
								env === "vm"
									? "border-primary bg-primary"
									: "border-muted-foreground",
							)}
						/>
						<div>
							<p className="font-medium">Virtual Machine</p>
							<p className="text-muted-foreground text-sm">
								Access a VM configured cluster to run workloads. (Coming soon)
							</p>
						</div>
					</button>
				</CardContent>
			</Card>
		</Example>
	);
}

function NumberStepperExample() {
	const [value, setValue] = React.useState(8);
	return (
		<Example title="Number of GPUs">
			<FieldGroup>
				<div>
					<FieldLabel>Number of GPUs</FieldLabel>
					<p className="text-muted-foreground text-sm">
						You can add more later.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={() => setValue((v) => Math.max(0, v - 1))}
					>
						−
					</Button>
					<Input
						type="number"
						value={value}
						onChange={(e) => setValue(Number(e.target.value) || 0)}
						className="w-20 text-center"
					/>
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={() => setValue((v) => v + 1)}
					>
						+
					</Button>
				</div>
			</FieldGroup>
		</Example>
	);
}

function ToggleExample() {
	return (
		<Example title="Wallpaper Tinting">
			<Field orientation="horizontal">
				<FieldContent>
					<FieldLabel htmlFor="switch-focus-mode">
						Share across devices
					</FieldLabel>
					<FieldDescription>
						Focus is shared across devices, and turns off when you leave the
						app.
					</FieldDescription>
				</FieldContent>
				<Switch id="switch-focus-mode" />
			</Field>
		</Example>
	);
}

function TermsCheckboxExample() {
	return (
		<Example title="Terms">
			<Field orientation="horizontal">
				<Checkbox
					id="terms-checkbox-2"
					name="terms-checkbox-2"
					defaultChecked
				/>
				<FieldContent>
					<FieldLabel htmlFor="terms-checkbox-2">
						Accept terms and conditions
					</FieldLabel>
					<FieldDescription>
						By clicking this checkbox, you agree to the terms.
					</FieldDescription>
				</FieldContent>
			</Field>
		</Example>
	);
}

function PaginationExample() {
	const [page, setPage] = React.useState(1);
	return (
		<Example title="Pagination">
			<div className="flex max-w-sm flex-wrap items-center gap-2">
				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="icon"
						onClick={() => setPage((p) => Math.max(1, p - 1))}
						disabled={page <= 1}
					>
						<ArrowLeftIcon className="size-4" />
						<span className="sr-only">Previous</span>
					</Button>
					{[1, 2, 3].map((n) => (
						<Button
							key={n}
							variant={page === n ? "default" : "outline"}
							size="icon"
							onClick={() => setPage(n)}
						>
							{n}
						</Button>
					))}
					<Button
						variant="outline"
						size="icon"
						onClick={() => setPage((p) => Math.min(3, p + 1))}
						disabled={page >= 3}
					>
						<ArrowRightIcon className="size-4" />
						<span className="sr-only">Next</span>
					</Button>
				</div>
				<Select defaultValue="copilot">
					<SelectTrigger className="w-[120px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="copilot">Copilot</SelectItem>
							<SelectItem value="assistant">Assistant</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</Example>
	);
}

function SegmentedExample() {
	return (
		<Example title="How did you hear about us?">
			<Tabs defaultValue="overview" className="w-[400px]">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="analytics">Analytics</TabsTrigger>
					<TabsTrigger value="reports">Reports</TabsTrigger>
					<TabsTrigger value="settings">Settings</TabsTrigger>
				</TabsList>
				<TabsContent value="overview">
					<Card>
						<CardHeader>
							<CardTitle>Overview</CardTitle>
							<CardDescription>
								View your key metrics and recent project activity. Track
								progress across all your active projects.
							</CardDescription>
						</CardHeader>
						<CardContent className="text-muted-foreground text-sm">
							You have 12 active projects and 3 pending tasks.
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="analytics">
					<Card>
						<CardHeader>
							<CardTitle>Analytics</CardTitle>
							<CardDescription>
								Track performance and user engagement metrics. Monitor trends
								and identify growth opportunities.
							</CardDescription>
						</CardHeader>
						<CardContent className="text-muted-foreground text-sm">
							Page views are up 25% compared to last month.
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="reports">
					<Card>
						<CardHeader>
							<CardTitle>Reports</CardTitle>
							<CardDescription>
								Generate and download your detailed reports. Export data in
								multiple formats for analysis.
							</CardDescription>
						</CardHeader>
						<CardContent className="text-muted-foreground text-sm">
							You have 5 reports ready and available to export.
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="settings">
					<Card>
						<CardHeader>
							<CardTitle>Settings</CardTitle>
							<CardDescription>
								Manage your account preferences and options. Customize your
								experience to fit your needs.
							</CardDescription>
						</CardHeader>
						<CardContent className="text-muted-foreground text-sm">
							Configure notifications, security, and themes.
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</Example>
	);
}

function ProcessingExample() {
	const [cancelled, setCancelled] = React.useState(false);
	return (
		<Example title="Processing" className="items-center justify-center">
			<Card className="w-full max-w-sm">
				<CardContent className="flex flex-col items-center gap-4 pt-6">
					{cancelled ? (
						<>
							<p className="font-medium">Cancelled</p>
							<Button variant="outline" onClick={() => setCancelled(false)}>
								Retry
							</Button>
						</>
					) : (
						<>
							<LoaderIcon className="text-primary size-10 animate-spin" />
							<div className="text-center">
								<CardTitle>Processing your request</CardTitle>
								<CardDescription>
									Please wait while we process your request. Do not refresh the
									page.
								</CardDescription>
							</div>
							<Button variant="outline" onClick={() => setCancelled(true)}>
								Cancel
							</Button>
						</>
					)}
				</CardContent>
			</Card>
		</Example>
	);
}

function SkeletonCardExample() {
	return (
		<Example title="Skeleton Card">
			<Card className="w-full max-w-xs">
				<CardHeader>
					<Skeleton className="h-4 w-2/3" />
					<Skeleton className="h-4 w-1/2" />
				</CardHeader>
				<CardContent>
					<Skeleton className="aspect-video w-full" />
				</CardContent>
			</Card>
		</Example>
	);
}
